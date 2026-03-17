package parse

import (
	"math"
	"testing"
	"time"
)

func TestCalcRelativeHumidityUsesRealCelsiusConversion(t *testing.T) {
	got := calcRelativeHumidity(86, 70)
	if math.Abs(got-58.98) > 0.2 {
		t.Fatalf("calcRelativeHumidity(86, 70) = %.2f, want about 58.98", got)
	}
}

func TestProcessLineParsesFullGSODFields(t *testing.T) {
	line := "010010 99999  20250122    30.1  7    25.8  7  1008.3  7  1007.1  7   12.4  4   13.0  7   15.5   21.0    31.3    25.7  99.99  999.9  011000"

	got, err := processLine(line)
	if err != nil {
		t.Fatalf("processLine returned error: %v", err)
	}

	if got.date != time.Date(2025, time.January, 22, 0, 0, 0, 0, time.UTC) {
		t.Fatalf("date = %v, want 2025-01-22 UTC", got.date)
	}
	if got.visib != 12.4 {
		t.Fatalf("visib = %.1f, want 12.4", got.visib)
	}
	if isPresent(got.precip) {
		t.Fatalf("precip = %v, want missing value", got.precip)
	}
	if got.precipFlag != "" {
		t.Fatalf("precipFlag = %q, want empty", got.precipFlag)
	}
	if got.flags.fog || !got.flags.rain || !got.flags.snow || got.flags.hail || got.flags.thunder || got.flags.tornado {
		t.Fatalf("flags = %+v, want rain/snow only", got.flags)
	}
}

func TestProcessDayAllowsMissingPrecipitationWhenOtherwisePleasant(t *testing.T) {
	station := &Station{Weather: TotalWeather{Months: map[string]MonthWeather{}}}
	day := weatherData{
		date:    time.Date(2025, time.July, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 78,
		minTemp: 60,
		precip:  missingFloat,
		station: "010010-99999",
		wind:    5,
		maxWind: 10,
		flags:   weatherFlags{},
	}

	processDay(station, day)

	month := station.Weather.Months["July"]
	if month.Bad != 0 {
		t.Fatalf("Bad = %.0f, want 0 for missing precipitation", month.Bad)
	}
	if month.Good != 1 {
		t.Fatalf("Good = %.0f, want 1 when missing precipitation is not marked incomplete", month.Good)
	}
	if month.total != 1 {
		t.Fatalf("total = %d, want 1", month.total)
	}
}

func TestProcessDayBlocksPleasantWhenPrecipitationReportIsIncomplete(t *testing.T) {
	station := &Station{Weather: TotalWeather{Months: map[string]MonthWeather{}}}
	day := weatherData{
		date:       time.Date(2025, time.July, 1, 0, 0, 0, 0, time.UTC),
		avgTemp:    70,
		visib:      10,
		maxTemp:    78,
		minTemp:    60,
		precip:     0,
		precipFlag: "H",
		flags:      weatherFlags{},
	}

	processDay(station, day)

	month := station.Weather.Months["July"]
	if month.Bad != 0 {
		t.Fatalf("Bad = %.0f, want 0 for incomplete precipitation report", month.Bad)
	}
	if month.Good != 0 {
		t.Fatalf("Good = %.0f, want 0 when precipitation report is incomplete", month.Good)
	}
}

func TestProcessDayAllowsPleasantWhenPrecipitationFlagIsI(t *testing.T) {
	station := &Station{Weather: TotalWeather{Months: map[string]MonthWeather{}}}
	day := weatherData{
		date:       time.Date(2025, time.July, 1, 0, 0, 0, 0, time.UTC),
		avgTemp:    70,
		visib:      10,
		maxTemp:    78,
		minTemp:    60,
		precip:     missingFloat,
		precipFlag: "I",
		flags:      weatherFlags{},
	}

	processDay(station, day)

	month := station.Weather.Months["July"]
	if month.Bad != 0 {
		t.Fatalf("Bad = %.0f, want 0 when precipitation flag is I", month.Bad)
	}
	if month.Good != 1 {
		t.Fatalf("Good = %.0f, want 1 when precipitation flag is I", month.Good)
	}
}

func TestClassifyDayCapturesNearMissAndUnpleasantReasons(t *testing.T) {
	nearMiss := weatherData{
		date:    time.Date(2025, time.July, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 83,
		minTemp: 60,
		precip:  0,
		flags:   weatherFlags{},
	}

	nearMissClassification := classifyDay(nearMiss)
	if nearMissClassification.isPleasant {
		t.Fatal("near miss classified as pleasant, want false")
	}
	if nearMissClassification.isUnpleasant {
		t.Fatal("near miss classified as unpleasant, want false")
	}
	if !nearMissClassification.pleasantBlockers[pleasantBlockerMaxTemp] {
		t.Fatal("near miss missing max temp blocker")
	}
	if nearMissClassification.pleasantBlockerCount() != 1 {
		t.Fatalf("near miss blocker count = %d, want 1", nearMissClassification.pleasantBlockerCount())
	}

	unpleasant := weatherData{
		date:    time.Date(2025, time.July, 2, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 78,
		minTemp: 60,
		precip:  0.30,
		flags:   weatherFlags{},
	}

	unpleasantClassification := classifyDay(unpleasant)
	if !unpleasantClassification.isUnpleasant {
		t.Fatal("unpleasant day classified as non-unpleasant, want true")
	}
	if !unpleasantClassification.unpleasantChecks[unpleasantCheckPrecip] {
		t.Fatal("unpleasant day missing precipitation trigger")
	}
	if unpleasantClassification.unpleasantTriggerCount() != 1 {
		t.Fatalf("unpleasant trigger count = %d, want 1", unpleasantClassification.unpleasantTriggerCount())
	}
}

func TestClassifyDayAvgBelow40CanBeNeutralWhenMaxReaches50(t *testing.T) {
	day := weatherData{
		date:    time.Date(2025, time.March, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 39,
		visib:   10,
		maxTemp: 50,
		minTemp: 32,
		precip:  0,
		flags:   weatherFlags{},
	}

	classification := classifyDay(day)
	if classification.isUnpleasant {
		t.Fatal("day classified as unpleasant, want false when avg < 40F but max reaches 50F")
	}
	if classification.unpleasantChecks[unpleasantCheckTemp] {
		t.Fatal("temp unpleasant check = true, want false when avg < 40F but max reaches 50F")
	}
}

func TestClassifyDayAvgBelow40StillUnpleasantWhenMaxStaysBelow50(t *testing.T) {
	day := weatherData{
		date:    time.Date(2025, time.March, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 39,
		visib:   10,
		maxTemp: 49,
		minTemp: 32,
		precip:  0,
		flags:   weatherFlags{},
	}

	classification := classifyDay(day)
	if !classification.isUnpleasant {
		t.Fatal("day classified as non-unpleasant, want true when avg < 40F and max stays below 50F")
	}
	if !classification.unpleasantChecks[unpleasantCheckTemp] {
		t.Fatal("temp unpleasant check = false, want true when avg < 40F and max stays below 50F")
	}
}

func TestWeatherDebugStatsTrackSoloTriggersAndNearMisses(t *testing.T) {
	SetWeatherDebug(true)
	t.Cleanup(func() {
		SetWeatherDebug(false)
	})
	resetWeatherDebug()

	pleasantDay := weatherData{
		date:    time.Date(2025, time.July, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 78,
		minTemp: 60,
		precip:  0,
		flags:   weatherFlags{},
	}
	unpleasantDay := weatherData{
		date:    time.Date(2025, time.July, 2, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 78,
		minTemp: 60,
		precip:  0.30,
		flags:   weatherFlags{},
	}
	maxTempNearMissDay := weatherData{
		date:    time.Date(2025, time.July, 3, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 83,
		minTemp: 60,
		precip:  0,
		flags:   weatherFlags{},
	}
	missingPrecipDay := weatherData{
		date:    time.Date(2025, time.July, 4, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 78,
		minTemp: 60,
		precip:  missingFloat,
		flags:   weatherFlags{},
	}
	incompletePrecipDay := weatherData{
		date:       time.Date(2025, time.July, 5, 0, 0, 0, 0, time.UTC),
		avgTemp:    70,
		visib:      10,
		maxTemp:    78,
		minTemp:    60,
		precip:     0,
		precipFlag: "H",
		flags:      weatherFlags{},
	}

	recordWeatherDebug(pleasantDay, classifyDay(pleasantDay))
	recordWeatherDebug(unpleasantDay, classifyDay(unpleasantDay))
	recordWeatherDebug(maxTempNearMissDay, classifyDay(maxTempNearMissDay))
	recordWeatherDebug(missingPrecipDay, classifyDay(missingPrecipDay))
	recordWeatherDebug(incompletePrecipDay, classifyDay(incompletePrecipDay))

	if weatherDebug.totalDays != 5 {
		t.Fatalf("totalDays = %d, want 5", weatherDebug.totalDays)
	}
	if weatherDebug.pleasantDays != 2 {
		t.Fatalf("pleasantDays = %d, want 2", weatherDebug.pleasantDays)
	}
	if weatherDebug.unpleasantDays != 1 {
		t.Fatalf("unpleasantDays = %d, want 1", weatherDebug.unpleasantDays)
	}
	if weatherDebug.neutralDays != 2 {
		t.Fatalf("neutralDays = %d, want 2", weatherDebug.neutralDays)
	}
	if weatherDebug.unpleasantHits[unpleasantCheckPrecip] != 1 {
		t.Fatalf("unpleasant precip hits = %d, want 1", weatherDebug.unpleasantHits[unpleasantCheckPrecip])
	}
	if weatherDebug.unpleasantSolo[unpleasantCheckPrecip] != 1 {
		t.Fatalf("unpleasant precip solo = %d, want 1", weatherDebug.unpleasantSolo[unpleasantCheckPrecip])
	}
	if weatherDebug.pleasantBlocks[pleasantBlockerMaxTemp] != 1 {
		t.Fatalf("pleasant max temp blockers = %d, want 1", weatherDebug.pleasantBlocks[pleasantBlockerMaxTemp])
	}
	if weatherDebug.pleasantNearMissSolo[pleasantBlockerMaxTemp] != 1 {
		t.Fatalf("pleasant max temp near-miss solo = %d, want 1", weatherDebug.pleasantNearMissSolo[pleasantBlockerMaxTemp])
	}
	if weatherDebug.pleasantBlocks[pleasantBlockerIncompletePrecip] != 1 {
		t.Fatalf("pleasant incomplete precip blockers = %d, want 1", weatherDebug.pleasantBlocks[pleasantBlockerIncompletePrecip])
	}
	if weatherDebug.pleasantNearMissSolo[pleasantBlockerIncompletePrecip] != 1 {
		t.Fatalf("pleasant incomplete precip near-miss solo = %d, want 1", weatherDebug.pleasantNearMissSolo[pleasantBlockerIncompletePrecip])
	}
	if weatherDebug.pleasantMaxTempBuckets[pleasantTempBucketNear] != 1 {
		t.Fatalf("pleasant max-temp near bucket = %d, want 1", weatherDebug.pleasantMaxTempBuckets[pleasantTempBucketNear])
	}
	if weatherDebug.pleasantMaxTempNearMissBuckets[pleasantTempBucketNear] != 1 {
		t.Fatalf("pleasant max-temp near near-miss bucket = %d, want 1", weatherDebug.pleasantMaxTempNearMissBuckets[pleasantTempBucketNear])
	}
}

func TestWeatherDebugTracksUnpleasantBreakdowns(t *testing.T) {
	SetWeatherDebug(true)
	t.Cleanup(func() {
		SetWeatherDebug(false)
	})
	resetWeatherDebug()

	coldSoloDay := weatherData{
		date:    time.Date(2025, time.January, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 30,
		visib:   10,
		maxTemp: 40,
		minTemp: 20,
		precip:  0,
		flags:   weatherFlags{},
	}
	hotSoloDay := weatherData{
		date:    time.Date(2025, time.August, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 97,
		visib:   10,
		maxTemp: 103,
		minTemp: 82,
		precip:  0,
		flags:   weatherFlags{},
	}
	precipSoloDay := weatherData{
		date:    time.Date(2025, time.September, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 78,
		minTemp: 60,
		precip:  1.25,
		flags:   weatherFlags{},
	}
	harshSoloDay := weatherData{
		date:    time.Date(2025, time.December, 1, 0, 0, 0, 0, time.UTC),
		avgTemp: 70,
		visib:   10,
		maxTemp: 78,
		minTemp: 60,
		precip:  0,
		flags: weatherFlags{
			snow:    true,
			thunder: true,
		},
	}

	recordWeatherDebug(coldSoloDay, classifyDay(coldSoloDay))
	recordWeatherDebug(hotSoloDay, classifyDay(hotSoloDay))
	recordWeatherDebug(precipSoloDay, classifyDay(precipSoloDay))
	recordWeatherDebug(harshSoloDay, classifyDay(harshSoloDay))

	if weatherDebug.unpleasantTempBuckets[unpleasantTempBucketColdExtreme] != 1 {
		t.Fatalf("cold extreme unpleasant temp bucket = %d, want 1", weatherDebug.unpleasantTempBuckets[unpleasantTempBucketColdExtreme])
	}
	if weatherDebug.unpleasantTempSoloBuckets[unpleasantTempBucketColdExtreme] != 1 {
		t.Fatalf("cold extreme unpleasant temp solo bucket = %d, want 1", weatherDebug.unpleasantTempSoloBuckets[unpleasantTempBucketColdExtreme])
	}
	if weatherDebug.unpleasantTempBuckets[unpleasantTempBucketHotStrong] != 1 {
		t.Fatalf("hot strong unpleasant temp bucket = %d, want 1", weatherDebug.unpleasantTempBuckets[unpleasantTempBucketHotStrong])
	}
	if weatherDebug.unpleasantTempSoloBuckets[unpleasantTempBucketHotStrong] != 1 {
		t.Fatalf("hot strong unpleasant temp solo bucket = %d, want 1", weatherDebug.unpleasantTempSoloBuckets[unpleasantTempBucketHotStrong])
	}
	if weatherDebug.unpleasantPrecipBuckets[unpleasantPrecipBucketHeavy] != 1 {
		t.Fatalf("heavy unpleasant precip bucket = %d, want 1", weatherDebug.unpleasantPrecipBuckets[unpleasantPrecipBucketHeavy])
	}
	if weatherDebug.unpleasantPrecipSoloBuckets[unpleasantPrecipBucketHeavy] != 1 {
		t.Fatalf("heavy unpleasant precip solo bucket = %d, want 1", weatherDebug.unpleasantPrecipSoloBuckets[unpleasantPrecipBucketHeavy])
	}
	if weatherDebug.unpleasantHarshHits[harshEventSnow] != 1 {
		t.Fatalf("snow harsh hits = %d, want 1", weatherDebug.unpleasantHarshHits[harshEventSnow])
	}
	if weatherDebug.unpleasantHarshSolo[harshEventSnow] != 1 {
		t.Fatalf("snow harsh solo = %d, want 1", weatherDebug.unpleasantHarshSolo[harshEventSnow])
	}
	if weatherDebug.unpleasantHarshHits[harshEventThunder] != 1 {
		t.Fatalf("thunder harsh hits = %d, want 1", weatherDebug.unpleasantHarshHits[harshEventThunder])
	}
	if weatherDebug.unpleasantHarshSolo[harshEventThunder] != 1 {
		t.Fatalf("thunder harsh solo = %d, want 1", weatherDebug.unpleasantHarshSolo[harshEventThunder])
	}
}

func TestParseFRSHTTMapsNOAAFlags(t *testing.T) {
	got, err := parseFRSHTT("101110")
	if err != nil {
		t.Fatalf("parseFRSHTT returned error: %v", err)
	}

	if !got.fog || got.rain || !got.snow || !got.hail || !got.thunder || got.tornado {
		t.Fatalf("parseFRSHTT = %+v, want fog/snow/hail/thunder only", got)
	}
	if !got.hasHarshOutdoorEvent() {
		t.Fatal("hasHarshOutdoorEvent = false, want true")
	}
}

func TestParseFRSHTTRainOnlyIsNotHarsh(t *testing.T) {
	got, err := parseFRSHTT("010000")
	if err != nil {
		t.Fatalf("parseFRSHTT returned error: %v", err)
	}

	if got.hasHarshOutdoorEvent() {
		t.Fatal("rain-only FRSHTT marked harsh, want false")
	}
}

func TestParsePrecipFlag(t *testing.T) {
	if got := parsePrecipFlag(" 0.00G"); got != "G" {
		t.Fatalf("parsePrecipFlag = %q, want %q", got, "G")
	}
	if got := parsePrecipFlag("99.99 "); got != "" {
		t.Fatalf("parsePrecipFlag = %q, want empty", got)
	}
}

func TestAddStationsReturnsWhenNoNeighborsExist(t *testing.T) {
	var in [mapRows][mapCols][]Station

	got := addStations(in, 10, 10)
	if len(got.stations) != 0 {
		t.Fatalf("addStations returned %d stations, want 0", len(got.stations))
	}
	if got.coverage != coverageDirect {
		t.Fatalf("addStations coverage = %v, want %v", got.coverage, coverageDirect)
	}
}

func TestAddStationsStopsAtPreferredRadiusWhenDataExists(t *testing.T) {
	var in [mapRows][mapCols][]Station
	in[10][12] = []Station{{lat: 10, long: 12, weighted: localStationWeight}}
	in[12][13] = []Station{{lat: 12, long: 13, weighted: localStationWeight}}

	got := addStations(in, 10, 10)
	if len(got.stations) != 1 {
		t.Fatalf("addStations returned %d stations, want 1", len(got.stations))
	}
	if got.stations[0].lat != 10 || got.stations[0].long != 12 {
		t.Fatalf("addStations returned station at (%d,%d), want (10,12)", got.stations[0].lat, got.stations[0].long)
	}
	if got.coverage != coverageLight {
		t.Fatalf("addStations coverage = %v, want %v", got.coverage, coverageLight)
	}
}

func TestAddStationsFallsBackBeyondPreferredRadiusWhenNoAlternativeExists(t *testing.T) {
	var in [mapRows][mapCols][]Station
	in[13][13] = []Station{{lat: 13, long: 13, weighted: localStationWeight}}

	got := addStations(in, 10, 10)
	if len(got.stations) != 1 {
		t.Fatalf("addStations returned %d stations, want 1", len(got.stations))
	}
	if got.stations[0].lat != 13 || got.stations[0].long != 13 {
		t.Fatalf("addStations returned station at (%d,%d), want (13,13)", got.stations[0].lat, got.stations[0].long)
	}
	if got.coverage != coverageHeavy {
		t.Fatalf("addStations coverage = %v, want %v", got.coverage, coverageHeavy)
	}
}

func TestAddStationsKeepsLocalWeightAboveBorrowedWeight(t *testing.T) {
	var in [mapRows][mapCols][]Station
	in[10][10] = []Station{{lat: 10, long: 10, weighted: localStationWeight}}
	in[10][11] = []Station{{lat: 10, long: 11, weighted: localStationWeight}}

	got := addStations(in, 10, 10)
	if len(got.stations) != 2 {
		t.Fatalf("addStations returned %d stations, want 2", len(got.stations))
	}
	if got.stations[0].weighted <= got.stations[1].weighted {
		t.Fatalf("local weight = %d, borrowed weight = %d, want local > borrowed", got.stations[0].weighted, got.stations[1].weighted)
	}
}

func TestToStationIDIncludesWBAN(t *testing.T) {
	line := "690150 93121  20250101    70.0  1    50.0  1  1010.0  1  1008.0  1   10.0  1    5.0  1    7.0   10.0    80.0    60.0   0.00G 999.9  000000"

	if got := toStationID(line); got != "690150-93121" {
		t.Fatalf("toStationID = %q, want %q", got, "690150-93121")
	}
}

func TestParseGSODFloatStripsSuffixesAndSentinels(t *testing.T) {
	got, err := parseGSODFloat(" 0.05G", "99.99")
	if err != nil {
		t.Fatalf("parseGSODFloat returned error: %v", err)
	}
	if got != 0.05 {
		t.Fatalf("parseGSODFloat = %.2f, want 0.05", got)
	}

	got, err = parseGSODFloat("99.99", "99.99")
	if err != nil {
		t.Fatalf("parseGSODFloat sentinel returned error: %v", err)
	}
	if isPresent(got) {
		t.Fatalf("parseGSODFloat sentinel = %v, want missing value", got)
	}
}
