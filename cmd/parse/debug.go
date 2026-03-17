package parse

import (
	"fmt"
	"sync"
)

var coverageLevelLabels = [coverageLevelCount]string{
	"direct local data",
	"lightly supplemented local data",
	"light borrowed-only fallback",
	"heavily supplemented local data",
	"heavy borrowed-only fallback",
}

type unpleasantTempBucket int

const (
	unpleasantTempBucketColdExtreme unpleasantTempBucket = iota
	unpleasantTempBucketColdNear
	unpleasantTempBucketHotNear
	unpleasantTempBucketHotStrong
	unpleasantTempBucketHotExtreme
	unpleasantTempBucketCount
)

var unpleasantTempBucketLabels = [unpleasantTempBucketCount]string{
	"below 32F",
	"32F to <45F",
	">88F to <=95F",
	">95F to <=100F",
	"above 100F",
}

type unpleasantPrecipBucket int

const (
	unpleasantPrecipBucketNear unpleasantPrecipBucket = iota
	unpleasantPrecipBucketModerate
	unpleasantPrecipBucketHeavy
	unpleasantPrecipBucketExtreme
	unpleasantPrecipBucketCount
)

var unpleasantPrecipBucketLabels = [unpleasantPrecipBucketCount]string{
	"0.20in to <0.50in",
	"0.50in to <1.00in",
	"1.00in to <2.00in",
	"2.00in+",
}

type harshEventBucket int

const (
	harshEventSnow harshEventBucket = iota
	harshEventHail
	harshEventThunder
	harshEventTornado
	harshEventBucketCount
)

var harshEventBucketLabels = [harshEventBucketCount]string{
	"snow or ice pellets",
	"hail",
	"thunder",
	"tornado or funnel cloud",
}

type pleasantTempBucket int

const (
	pleasantTempBucketNear pleasantTempBucket = iota
	pleasantTempBucketModerate
	pleasantTempBucketStrong
	pleasantTempBucketExtreme
	pleasantTempBucketCount
)

var pleasantMaxTempBucketLabels = [pleasantTempBucketCount]string{
	"82F to <85F",
	"85F to <90F",
	"90F to <95F",
	"95F+",
}

var pleasantMinTempBucketLabels = [pleasantTempBucketCount]string{
	">50F to 55F",
	">45F to 50F",
	">40F to 45F",
	"40F or below",
}

type unpleasantCheck int

const (
	unpleasantCheckTemp unpleasantCheck = iota
	unpleasantCheckVisibility
	unpleasantCheckPrecip
	unpleasantCheckHarshWeather
	unpleasantCheckCount
)

var unpleasantCheckLabels = [unpleasantCheckCount]string{
	"avg temp outside unpleasant band",
	"visibility below unpleasant threshold",
	"precipitation above unpleasant threshold",
	"harsh weather event",
}

type pleasantBlocker int

const (
	pleasantBlockerMissingAvgTemp pleasantBlocker = iota
	pleasantBlockerMissingVisibility
	pleasantBlockerMissingMaxTemp
	pleasantBlockerMissingMinTemp
	pleasantBlockerIncompletePrecip
	pleasantBlockerAvgTempRange
	pleasantBlockerVisibility
	pleasantBlockerMaxTemp
	pleasantBlockerMinTemp
	pleasantBlockerPrecip
	pleasantBlockerHarshWeather
	pleasantBlockerCount
)

var pleasantBlockerLabels = [pleasantBlockerCount]string{
	"missing average temperature",
	"missing visibility",
	"missing max temperature",
	"missing min temperature",
	"incomplete precipitation report",
	"average temperature outside pleasant band",
	"visibility at or below pleasant threshold",
	"max temperature at or above pleasant threshold",
	"min temperature at or below pleasant threshold",
	"precipitation at or above pleasant threshold",
	"harsh weather event",
}

type dayClassification struct {
	isPleasant   bool
	isUnpleasant bool

	unpleasantChecks [unpleasantCheckCount]bool
	pleasantBlockers [pleasantBlockerCount]bool
}

func (c dayClassification) unpleasantTriggerCount() int {
	count := 0
	for _, triggered := range c.unpleasantChecks {
		if triggered {
			count++
		}
	}
	return count
}

func (c dayClassification) pleasantBlockerCount() int {
	count := 0
	for _, blocked := range c.pleasantBlockers {
		if blocked {
			count++
		}
	}
	return count
}

type weatherDebugStats struct {
	mu sync.Mutex

	totalDays      int
	pleasantDays   int
	unpleasantDays int
	neutralDays    int

	unpleasantHits [unpleasantCheckCount]int
	unpleasantSolo [unpleasantCheckCount]int

	unpleasantTempBuckets       [unpleasantTempBucketCount]int
	unpleasantTempSoloBuckets   [unpleasantTempBucketCount]int
	unpleasantPrecipBuckets     [unpleasantPrecipBucketCount]int
	unpleasantPrecipSoloBuckets [unpleasantPrecipBucketCount]int
	unpleasantHarshHits         [harshEventBucketCount]int
	unpleasantHarshSolo         [harshEventBucketCount]int

	pleasantBlocks       [pleasantBlockerCount]int
	pleasantNearMissSolo [pleasantBlockerCount]int

	pleasantMaxTempBuckets         [pleasantTempBucketCount]int
	pleasantMaxTempNearMissBuckets [pleasantTempBucketCount]int
	pleasantMinTempBuckets         [pleasantTempBucketCount]int
	pleasantMinTempNearMissBuckets [pleasantTempBucketCount]int

	coverageCounts [coverageLevelCount]int
}

var weatherDebug *weatherDebugStats

func SetWeatherDebug(enabled bool) {
	if enabled {
		weatherDebug = &weatherDebugStats{}
		return
	}
	weatherDebug = nil
}

func resetWeatherDebug() {
	if weatherDebug == nil {
		return
	}
	weatherDebug = &weatherDebugStats{}
}

func recordWeatherDebug(day weatherData, classification dayClassification) {
	if weatherDebug == nil {
		return
	}

	weatherDebug.mu.Lock()
	defer weatherDebug.mu.Unlock()

	weatherDebug.totalDays++
	switch {
	case classification.isUnpleasant:
		weatherDebug.unpleasantDays++
	case classification.isPleasant:
		weatherDebug.pleasantDays++
	default:
		weatherDebug.neutralDays++
	}

	unpleasantCount := classification.unpleasantTriggerCount()
	for idx, triggered := range classification.unpleasantChecks {
		if !triggered {
			continue
		}
		weatherDebug.unpleasantHits[idx]++
		if unpleasantCount == 1 {
			weatherDebug.unpleasantSolo[idx]++
		}
	}

	if classification.unpleasantChecks[unpleasantCheckTemp] {
		bucket := unpleasantTempRangeBucket(day.avgTemp)
		weatherDebug.unpleasantTempBuckets[bucket]++
		if unpleasantCount == 1 {
			weatherDebug.unpleasantTempSoloBuckets[bucket]++
		}
	}

	if classification.unpleasantChecks[unpleasantCheckPrecip] {
		bucket := unpleasantPrecipAmountBucket(day.precip)
		weatherDebug.unpleasantPrecipBuckets[bucket]++
		if unpleasantCount == 1 {
			weatherDebug.unpleasantPrecipSoloBuckets[bucket]++
		}
	}

	if classification.unpleasantChecks[unpleasantCheckHarshWeather] {
		recordHarshEventBuckets(day.flags, unpleasantCount == 1)
	}

	pleasantBlockerCount := classification.pleasantBlockerCount()
	for idx, blocked := range classification.pleasantBlockers {
		if !blocked {
			continue
		}
		weatherDebug.pleasantBlocks[idx]++
		if !classification.isUnpleasant && pleasantBlockerCount == 1 {
			weatherDebug.pleasantNearMissSolo[idx]++
		}
	}

	if classification.pleasantBlockers[pleasantBlockerMaxTemp] {
		bucket := pleasantMaxTempBucket(day.maxTemp)
		weatherDebug.pleasantMaxTempBuckets[bucket]++
		if !classification.isUnpleasant && pleasantBlockerCount == 1 {
			weatherDebug.pleasantMaxTempNearMissBuckets[bucket]++
		}
	}

	if classification.pleasantBlockers[pleasantBlockerMinTemp] {
		bucket := pleasantMinTempBucket(day.minTemp)
		weatherDebug.pleasantMinTempBuckets[bucket]++
		if !classification.isUnpleasant && pleasantBlockerCount == 1 {
			weatherDebug.pleasantMinTempNearMissBuckets[bucket]++
		}
	}
}

func recordCoverageDebug(level coverageLevel) {
	if weatherDebug == nil {
		return
	}

	weatherDebug.mu.Lock()
	defer weatherDebug.mu.Unlock()

	if level >= coverageLevelCount {
		return
	}
	weatherDebug.coverageCounts[level]++
}

func printWeatherDebugSummary() {
	if weatherDebug == nil {
		return
	}

	weatherDebug.mu.Lock()
	defer weatherDebug.mu.Unlock()

	fmt.Println()
	fmt.Println("Weather classification debug summary")
	fmt.Printf("  Total days processed: %d\n", weatherDebug.totalDays)
	fmt.Printf("  Pleasant days: %d\n", weatherDebug.pleasantDays)
	fmt.Printf("  Unpleasant days: %d\n", weatherDebug.unpleasantDays)
	fmt.Printf("  Neutral days: %d\n", weatherDebug.neutralDays)

	fmt.Println("  Unpleasant trigger counts:")
	for idx, label := range unpleasantCheckLabels {
		fmt.Printf("    %s: %d hits, %d solo\n", label, weatherDebug.unpleasantHits[idx], weatherDebug.unpleasantSolo[idx])
	}

	fmt.Println("  Unpleasant temperature buckets:")
	for idx, label := range unpleasantTempBucketLabels {
		fmt.Printf("    %s: %d hits, %d solo\n", label, weatherDebug.unpleasantTempBuckets[idx], weatherDebug.unpleasantTempSoloBuckets[idx])
	}

	fmt.Println("  Unpleasant precipitation buckets:")
	for idx, label := range unpleasantPrecipBucketLabels {
		fmt.Printf("    %s: %d hits, %d solo\n", label, weatherDebug.unpleasantPrecipBuckets[idx], weatherDebug.unpleasantPrecipSoloBuckets[idx])
	}

	fmt.Println("  Unpleasant harsh-weather event buckets:")
	for idx, label := range harshEventBucketLabels {
		fmt.Printf("    %s: %d hits, %d solo\n", label, weatherDebug.unpleasantHarshHits[idx], weatherDebug.unpleasantHarshSolo[idx])
	}

	fmt.Println("  Pleasant blocker counts:")
	for idx, label := range pleasantBlockerLabels {
		fmt.Printf("    %s: %d blockers, %d sole near-miss\n", label, weatherDebug.pleasantBlocks[idx], weatherDebug.pleasantNearMissSolo[idx])
	}

	fmt.Println("  Pleasant max-temp blocker buckets:")
	for idx, label := range pleasantMaxTempBucketLabels {
		fmt.Printf("    %s: %d blockers, %d sole near-miss\n", label, weatherDebug.pleasantMaxTempBuckets[idx], weatherDebug.pleasantMaxTempNearMissBuckets[idx])
	}

	fmt.Println("  Pleasant min-temp blocker buckets:")
	for idx, label := range pleasantMinTempBucketLabels {
		fmt.Printf("    %s: %d blockers, %d sole near-miss\n", label, weatherDebug.pleasantMinTempBuckets[idx], weatherDebug.pleasantMinTempNearMissBuckets[idx])
	}

	lightCoverageTotal := weatherDebug.coverageCounts[coverageSupplementedLight] + weatherDebug.coverageCounts[coverageBorrowedLight]
	heavyCoverageTotal := weatherDebug.coverageCounts[coverageSupplementedHeavy] + weatherDebug.coverageCounts[coverageBorrowedHeavy]
	fmt.Println("  Map coverage summary:")
	fmt.Printf("    direct total: %d\n", weatherDebug.coverageCounts[coverageDirect])
	fmt.Printf("    light total: %d\n", lightCoverageTotal)
	fmt.Printf("    heavy total: %d\n", heavyCoverageTotal)
	for idx, label := range coverageLevelLabels {
		fmt.Printf("    %s: %d cells\n", label, weatherDebug.coverageCounts[idx])
	}
}

func pleasantMaxTempBucket(temp float64) pleasantTempBucket {
	switch {
	case temp < 85:
		return pleasantTempBucketNear
	case temp < 90:
		return pleasantTempBucketModerate
	case temp < 95:
		return pleasantTempBucketStrong
	default:
		return pleasantTempBucketExtreme
	}
}

func pleasantMinTempBucket(temp float64) pleasantTempBucket {
	switch {
	case temp > 50:
		return pleasantTempBucketNear
	case temp > 45:
		return pleasantTempBucketModerate
	case temp > 40:
		return pleasantTempBucketStrong
	default:
		return pleasantTempBucketExtreme
	}
}

func unpleasantTempRangeBucket(temp float64) unpleasantTempBucket {
	switch {
	case temp < 32:
		return unpleasantTempBucketColdExtreme
	case temp < unpleasantAvgTempMin:
		return unpleasantTempBucketColdNear
	case temp <= 95:
		return unpleasantTempBucketHotNear
	case temp <= 100:
		return unpleasantTempBucketHotStrong
	default:
		return unpleasantTempBucketHotExtreme
	}
}

func unpleasantPrecipAmountBucket(precip float64) unpleasantPrecipBucket {
	switch {
	case precip < 0.50:
		return unpleasantPrecipBucketNear
	case precip < 1.00:
		return unpleasantPrecipBucketModerate
	case precip < 2.00:
		return unpleasantPrecipBucketHeavy
	default:
		return unpleasantPrecipBucketExtreme
	}
}

func recordHarshEventBuckets(flags weatherFlags, solo bool) {
	if weatherDebug == nil {
		return
	}

	if flags.snow {
		weatherDebug.unpleasantHarshHits[harshEventSnow]++
		if solo {
			weatherDebug.unpleasantHarshSolo[harshEventSnow]++
		}
	}
	if flags.hail {
		weatherDebug.unpleasantHarshHits[harshEventHail]++
		if solo {
			weatherDebug.unpleasantHarshSolo[harshEventHail]++
		}
	}
	if flags.thunder {
		weatherDebug.unpleasantHarshHits[harshEventThunder]++
		if solo {
			weatherDebug.unpleasantHarshSolo[harshEventThunder]++
		}
	}
	if flags.tornado {
		weatherDebug.unpleasantHarshHits[harshEventTornado]++
		if solo {
			weatherDebug.unpleasantHarshSolo[harshEventTornado]++
		}
	}
}

func classifyDay(day weatherData) dayClassification {
	classification := dayClassification{}

	missingAvgTemp := !isPresent(day.avgTemp)
	missingVisibility := !isPresent(day.visib)
	missingMaxTemp := !isPresent(day.maxTemp)
	missingMinTemp := !isPresent(day.minTemp)
	missingPrecip := !isPresent(day.precip)
	hasHarshWeather := day.flags.hasHarshOutdoorEvent()
	hasIncompletePrecipReport := day.precipFlag == "H"
	isColdUnpleasant := !missingAvgTemp && day.avgTemp < unpleasantAvgTempMin && (missingMaxTemp || day.maxTemp < unpleasantAvgTempMin+10)
	isHotUnpleasant := !missingAvgTemp && day.avgTemp > unpleasantAvgTempMax

	classification.unpleasantChecks[unpleasantCheckTemp] = isColdUnpleasant || isHotUnpleasant
	classification.unpleasantChecks[unpleasantCheckVisibility] = !missingVisibility && day.visib < unpleasantVisibilityMax
	classification.unpleasantChecks[unpleasantCheckPrecip] = !missingPrecip && day.precip > unpleasantPrecipMin
	classification.unpleasantChecks[unpleasantCheckHarshWeather] = hasHarshWeather

	classification.pleasantBlockers[pleasantBlockerMissingAvgTemp] = missingAvgTemp
	classification.pleasantBlockers[pleasantBlockerMissingVisibility] = false
	classification.pleasantBlockers[pleasantBlockerMissingMaxTemp] = missingMaxTemp
	classification.pleasantBlockers[pleasantBlockerMissingMinTemp] = missingMinTemp
	classification.pleasantBlockers[pleasantBlockerIncompletePrecip] = hasIncompletePrecipReport
	classification.pleasantBlockers[pleasantBlockerAvgTempRange] = !missingAvgTemp && (day.avgTemp < pleasantAvgTempMin || day.avgTemp > pleasantAvgTempMax)
	classification.pleasantBlockers[pleasantBlockerVisibility] = !missingVisibility && day.visib <= pleasantVisibilityMin
	classification.pleasantBlockers[pleasantBlockerMaxTemp] = !missingMaxTemp && day.maxTemp >= pleasantMaxTempMax
	classification.pleasantBlockers[pleasantBlockerMinTemp] = !missingMinTemp && day.minTemp <= pleasantMinTempMin
	classification.pleasantBlockers[pleasantBlockerPrecip] = !missingPrecip && day.precip >= pleasantPrecipMax
	classification.pleasantBlockers[pleasantBlockerHarshWeather] = hasHarshWeather

	classification.isUnpleasant = classification.unpleasantTriggerCount() > 0
	classification.isPleasant = classification.pleasantBlockerCount() == 0

	return classification
}
