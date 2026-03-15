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
	if got.harshWeather != 11000 {
		t.Fatalf("harshWeather = %.0f, want 11000", got.harshWeather)
	}
}

func TestProcessDayDoesNotPenalizeMissingPrecipitation(t *testing.T) {
	station := &Station{Weather: TotalWeather{Months: map[string]MonthWeather{}}}
	day := weatherData{
		date:         time.Date(2025, time.July, 1, 0, 0, 0, 0, time.UTC),
		avgTemp:      70,
		visib:        10,
		maxTemp:      78,
		minTemp:      60,
		precip:       missingFloat,
		station:      "010010-99999",
		wind:         5,
		maxWind:      10,
		harshWeather: 0,
	}

	processDay(station, day)

	month := station.Weather.Months["July"]
	if month.Bad != 0 {
		t.Fatalf("Bad = %.0f, want 0 for missing precipitation", month.Bad)
	}
	if month.Good != 0 {
		t.Fatalf("Good = %.0f, want 0 when a required pleasant field is missing", month.Good)
	}
	if month.total != 1 {
		t.Fatalf("total = %d, want 1", month.total)
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
