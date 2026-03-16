package parse

import (
	"archive/tar"
	"bufio"
	"bytes"
	"compress/gzip"
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"os"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/cheggaaa/pb/v3"
)

const missingFloat = math.MaxFloat64

const (
	datasetStartYear = 2010
	datasetEndYear   = 2024
)

var (
	isdHistoryOnce sync.Once
	isdHistoryData map[string]Station
	isdHistoryErr  error
)

// TotalWeather All the weather for a year
type TotalWeather struct {
	Months    map[string]MonthWeather `json:"m"`
	totalDays int
}

// MonthWeather All the data for the entire month is condensed down to MonthWeather
type MonthWeather struct {
	Good   float64 `json:"g"`
	Bad    float64 `json:"b"`
	total  int
	years  int
	filled bool
}

// Station Contains one station with weather and location
type Station struct {
	lat      int
	long     int
	Weather  TotalWeather `json:"w"`
	weighted int
}

// Contains one day of weather information
type weatherData struct {
	station                         string
	visib, minTemp, maxTemp, precip float64
	avgTemp, wind, maxWind          float64
	flags                           weatherFlags
	precipFlag                      string
	date                            time.Time
}

type weatherFlags struct {
	fog     bool
	rain    bool
	snow    bool
	hail    bool
	thunder bool
	tornado bool
}

func (f weatherFlags) hasHarshOutdoorEvent() bool {
	return f.snow || f.hail || f.thunder || f.tornado
}

const (
	pleasantAvgTempMin      = 62.0
	pleasantAvgTempMax      = 75.0
	pleasantMaxTempMax      = 82.0
	pleasantMinTempMin      = 45.0
	pleasantVisibilityMin   = 6.0
	pleasantPrecipMax       = 0.10
	unpleasantAvgTempMin    = 40.0
	unpleasantAvgTempMax    = 88.0
	unpleasantVisibilityMax = 5.0
	unpleasantPrecipMin     = 0.20
)

// BuildWeatherMap Builds the weather map
func buildWeatherMap() ([mapRows][mapCols]Station, error) {
	resetWeatherDebug()

	years := make([]int, 0, datasetEndYear-datasetStartYear+1)
	for year := datasetStartYear; year <= datasetEndYear; year++ {
		years = append(years, year)
	}
	if len(years) == 0 {
		return [mapRows][mapCols]Station{}, nil
	}

	stations, err := parseISDHistory()
	if err != nil {
		return [mapRows][mapCols]Station{}, err
	}
	zips, err := makeMap()
	if err != nil {
		return [mapRows][mapCols]Station{}, err
	}

	type yearResult struct {
		idx int
		err error
	}

	fmt.Printf("Processing %d yearly weather archives\n", len(years))
	bar := pb.StartNew(len(years))
	defer bar.Finish()

	workers := runtime.NumCPU()
	if workers > len(years) {
		workers = len(years)
	}
	if workers < 1 {
		workers = 1
	}

	jobs := make(chan int)
	results := make(chan yearResult, len(years))
	allYears := make([][mapRows][mapCols]Station, len(years))

	var wg sync.WaitGroup
	for worker := 0; worker < workers; worker++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for idx := range jobs {
				year := years[idx]
				parsed, err := parseGSOD(year, stations)
				if err != nil {
					results <- yearResult{idx: idx, err: fmt.Errorf("parse %d: %w", year, err)}
					continue
				}
				averaged, err := averageStations(parsed, zips)
				if err != nil {
					results <- yearResult{idx: idx, err: fmt.Errorf("average %d: %w", year, err)}
					continue
				}
				allYears[idx] = averaged
				results <- yearResult{idx: idx}
			}
		}()
	}

	go func() {
		for idx := range years {
			jobs <- idx
		}
		close(jobs)
		wg.Wait()
		close(results)
	}()

	var firstErr error
	for result := range results {
		bar.Increment()
		if result.err != nil && firstErr == nil {
			firstErr = result.err
		}
	}
	if firstErr != nil {
		return [mapRows][mapCols]Station{}, firstErr
	}

	printWeatherDebugSummary()

	return averageYears(allYears), nil
}

// Averages all years of each station into one station at each US map location
func averageYears(years [][mapRows][mapCols]Station) [mapRows][mapCols]Station {
	avg := [mapRows][mapCols]Station{}
	for x, a := range avg {
		for y := range a {
			avg[x][y].Weather.Months = make(map[string]MonthWeather)
		}
	}
	for _, a := range years {
		for y, b := range a {
			for z, c := range b {
				for k := range c.Weather.Months {
					t := avg[y][z].Weather.Months[k]
					t.Good += c.Weather.Months[k].Good
					t.Bad += c.Weather.Months[k].Bad
					if c.Weather.Months[k].filled {
						t.years++
					}
					avg[y][z].Weather.Months[k] = t
				}
			}
		}
	}
	for x, a := range avg {
		for y, b := range a {
			for k := range b.Weather.Months {
				t := avg[x][y].Weather.Months[k]
				if b.Weather.Months[k].years == 0 {
					t.years = 1
				}
				t.Good = float64(math.Round(b.Weather.Months[k].Good / float64(b.Weather.Months[k].years)))
				t.Bad = float64(math.Round(b.Weather.Months[k].Bad / float64(b.Weather.Months[k].years)))
				avg[x][y].Weather.Months[k] = t
			}
		}
	}
	return avg
}

// Reads through a single GSOD file for the year and returns stations at each location
func parseGSOD(year int, stations map[string]Station) ([mapRows][mapCols][]Station, error) {
	filepath := fmt.Sprintf("data/gsod_%d.tar", year)
	weatherMap := [mapRows][mapCols][]Station{}
	file, err := os.Open(filepath)
	if err != nil {
		return weatherMap, err
	}
	defer file.Close()
	tarReader := tar.NewReader(file)
	var buffer bytes.Buffer
	for {
		nextfile, err := tarReader.Next()
		if err == io.EOF {
			return weatherMap, nil
		} else if err != nil {
			return weatherMap, err
		}
		if nextfile.FileInfo().IsDir() {
			continue
		}

		gzipF, err := gzip.NewReader(tarReader)
		if err != nil {
			return weatherMap, err
		}
		opReader := bufio.NewReader(gzipF)
		station := Station{lat: -1, long: -1, Weather: TotalWeather{}, weighted: 200}
		station.Weather.Months = make(map[string]MonthWeather)
		skipStation := false
		for {
			in, prefix, err := opReader.ReadLine()
			if err == io.EOF {
				break
			} else if err != nil {
				return weatherMap, err
			}
			buffer.Write(in)
			if prefix {
				continue
			}
			line := buffer.String()
			buffer.Reset()

			if strings.HasPrefix(line, "STN--- WBAN   YEARMODA") {
				continue
			}
			if station.lat == -1 || station.long == -1 {
				tempStation, ok := stations[toStationID(line)]
				if !ok {
					skipStation = true
					continue
				}
				station.lat = tempStation.lat
				station.long = tempStation.long
			}
			if skipStation {
				continue
			}
			data, err := processLine(line)
			if err != nil {
				return weatherMap, err
			}
			j := &station
			processDay(j, data)
		}
		if err := gzipF.Close(); err != nil {
			return weatherMap, err
		}
		if station.Weather.totalDays >= 330 {
			weatherMap[station.lat][station.long] = append(weatherMap[station.lat][station.long], station)
		}
	}
}

// Averages all stations in one location of the US map
func averageStations(in [mapRows][mapCols][]Station, zips [mapRows][mapCols][]zip) ([mapRows][mapCols]Station, error) {
	monthNum := map[string]float64{
		"January":   31,
		"February":  28,
		"March":     31,
		"April":     30,
		"May":       31,
		"June":      30,
		"July":      31,
		"August":    31,
		"September": 30,
		"October":   31,
		"November":  30,
		"December":  31,
	}
	out := [mapRows][mapCols]Station{}
	t := TotalWeather{}
	for x, a := range in {
		for y, b := range a {
			if len(b) < 4 {
				if len(zips[x][y]) > 0 {
					b = addStations(in, x, y)
				}
			}
			t = TotalWeather{}
			t.Months = make(map[string]MonthWeather)
			for _, c := range b {
				weight := c.weighted
				if weight < 1 {
					weight = 1
				}
				t.totalDays += c.Weather.totalDays * weight
				for k, a := range c.Weather.Months {
					d := t.Months[k]
					d.total += a.total * weight
					d.Good += a.Good * float64(weight)
					d.Bad += a.Bad * float64(weight)
					t.Months[k] = d
				}
			}
			for k := range t.Months {
				if t.Months[k].total != 0 {
					d := t.Months[k]
					d.Good = (d.Good / float64(d.total)) * monthNum[k]
					d.Bad = (d.Bad / float64(d.total)) * monthNum[k]
					d.filled = true
					t.Months[k] = d
				}
			}
			out[x][y] = Station{lat: x, long: y, Weather: t}
		}
	}
	return out, nil
}

func addStations(in [mapRows][mapCols][]Station, lat, long int) []Station {
	s := in[lat][long]
	radius := 1
	maxRadius := len(in)
	if len(in[0]) > maxRadius {
		maxRadius = len(in[0])
	}
	for len(s) < 4 && radius <= maxRadius {
		latGrid := lat - radius
		longGrid := long - radius
		for a := latGrid; a <= (latGrid + 2*radius + 1); a++ {
			for b := longGrid; b <= (longGrid + 2*radius + 1); b++ {
				if a >= 0 && b >= 0 && a < mapRows && b < mapCols {
					if len(in[a][b]) > 0 && (int(math.Abs(float64(a-lat))) == radius || int(math.Abs(float64(b-long))) == radius) {
						for c := range in[a][b] {
							in[a][b][c].weighted = int(200 / math.Pow(float64(radius), 2))
							if in[a][b][c].weighted < 1 {
								in[a][b][c].weighted = 1
							}
						}
						s = append(s, in[a][b]...)
					}
				}
			}
		}
		radius++
	}
	return s
}

// Takes in one day of weather and stores it to the station provided
func processDay(station *Station, day weatherData) {
	month := day.date.Month().String()
	t := station.Weather.Months[month]

	classification := classifyDay(day)
	recordWeatherDebug(day, classification)

	if classification.isUnpleasant {
		t.Bad++
	} else if classification.isPleasant {
		t.Good++
	}
	t.total++
	station.Weather.Months[month] = t
	station.Weather.totalDays++
}

// Takes in a line of GSOD data and converts it to a weatherData struct
func processLine(line string) (weatherData, error) {
	data := weatherData{}
	year, err := strconv.Atoi(line[14:18])
	if err != nil {
		return weatherData{}, err
	}
	month, err := strconv.Atoi(line[18:20])
	if err != nil {
		return weatherData{}, err
	}
	day, err := strconv.Atoi(line[20:22])
	if err != nil {
		return weatherData{}, err
	}

	data.date = time.Date(int(year), time.Month(month), int(day), 0, 0, 0, 0, time.UTC)

	tmp, err := parseGSODFloat(line[78:83], "999.9")
	if err != nil {
		return weatherData{}, err
	}
	data.wind = tmp

	tmp, err = parseGSODFloat(line[88:93], "999.9")
	if err != nil {
		return weatherData{}, err
	}
	data.maxWind = tmp

	tmp, err = parseGSODFloat(line[35:41], "9999.9")
	if err != nil {
		return weatherData{}, err
	}
	dewpoint := tmp

	tmp, err = parseGSODFloat(line[24:30], "9999.9")
	if err != nil {
		return weatherData{}, err
	}
	data.avgTemp = perceivedTemperature(tmp, dewpoint, data.wind)

	tmp, err = parseGSODFloat(line[102:108], "9999.9")
	if err != nil {
		return weatherData{}, err
	}
	data.maxTemp = perceivedTemperature(tmp, dewpoint, data.wind)

	tmp, err = parseGSODFloat(line[110:116], "9999.9")
	if err != nil {
		return weatherData{}, err
	}
	data.minTemp = perceivedTemperature(tmp, dewpoint, data.wind)

	rawPrecip := line[118:124]
	tmp, err = parseGSODFloat(rawPrecip, "99.99")
	if err != nil {
		return weatherData{}, err
	}
	data.precip = tmp
	data.precipFlag = parsePrecipFlag(rawPrecip)

	tmp, err = parseGSODFloat(line[68:73], "999.9")
	if err != nil {
		return weatherData{}, err
	}
	data.visib = tmp

	flags, err := parseFRSHTT(line[132:138])
	if err != nil {
		return weatherData{}, err
	}
	data.flags = flags

	return data, nil
}

func parseFRSHTT(raw string) (weatherFlags, error) {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return weatherFlags{}, nil
	}
	if len(trimmed) != 6 {
		return weatherFlags{}, fmt.Errorf("invalid FRSHTT value %q", raw)
	}

	flags := weatherFlags{}
	for idx, ch := range trimmed {
		if ch != '0' && ch != '1' {
			return weatherFlags{}, fmt.Errorf("invalid FRSHTT value %q", raw)
		}
		on := ch == '1'
		switch idx {
		case 0:
			flags.fog = on
		case 1:
			flags.rain = on
		case 2:
			flags.snow = on
		case 3:
			flags.hail = on
		case 4:
			flags.thunder = on
		case 5:
			flags.tornado = on
		}
	}

	return flags, nil
}

func parsePrecipFlag(raw string) string {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" {
		return ""
	}

	last := trimmed[len(trimmed)-1]
	if last < 'A' || last > 'Z' {
		return ""
	}

	return string(last)
}

func perceivedTemperature(temp, dewpoint, wind float64) float64 {
	if !isPresent(temp) {
		return temp
	}
	if temp > 80 && isPresent(dewpoint) && dewpoint > 40 {
		calcHeatIndex(&temp, calcRelativeHumidity(temp, dewpoint))
	} else if temp < 50 && isPresent(wind) && (wind*1.15078) > 3 {
		calcWindChill(&temp, wind)
	}
	return temp
}

// Calculates the windchill taken in a temp and the windspeed - used equation as defined on https://www.weather.gov/media/epz/wxcalc/windChill.pdf
func calcWindChill(temp *float64, wind float64) {
	wind *= 1.15078
	*temp = (((*temp * 0.6215) + 35.74) - (35.75 * math.Pow(wind, 0.16))) + (.4275 * *temp * math.Pow(wind, 0.16))
}

// Calculates the heat index taken in a temp and the humidity - used equation as defined on https://www.weather.gov/media/epz/wxcalc/heatIndex.pdf
func calcHeatIndex(temp *float64, humidity float64) {
	*temp = -42.379 + (2.04901523 * *temp) + (10.14333127 * humidity) - (0.22475541 * *temp * humidity) - (6.83783 * 0.001 * math.Pow(*temp, 2)) - (5.481717 * 0.01 * math.Pow(humidity, 2)) + (1.22874 * .001 * math.Pow(*temp, 2) * humidity) + (8.5282 * 0.0001 * *temp * math.Pow(humidity, 2)) - (1.99 * 0.000001 * math.Pow(*temp, 2) * math.Pow(humidity, 2))
}

// Calculates and returns the relative humidity given the temp and dewpoint - using http://bmcnoldy.rsmas.miami.edu/Humidity.html
func calcRelativeHumidity(temp, dewpoint float64) float64 {
	ftoC(&temp)
	ftoC(&dewpoint)
	return 100 * (math.Exp((17.625*dewpoint)/(243.04+dewpoint)) / math.Exp((17.625*temp)/(243.04+temp)))
}

// Converts fahrenheit to celsius
func ftoC(temp *float64) {
	*temp = (*temp - 32) * (5.0 / 9.0)
}

// Takes in a line of gsod data and returns the station corresponding to that line
func toStationID(l string) string {
	return fmt.Sprintf("%s-%s", strings.TrimSpace(l[0:6]), strings.TrimSpace(l[7:12]))
}

// returns a map that has station id as keys and the station data as values
func parseISDHistory() (map[string]Station, error) {
	isdHistoryOnce.Do(func() {
		stations := make(map[string]Station)
		file, err := os.Open("data/isd-history.csv")
		if err != nil {
			isdHistoryErr = err
			return
		}
		defer file.Close()

		reader := csv.NewReader(file)
		_, err = reader.Read() //skip the title line
		if err != nil {
			isdHistoryErr = err
			return
		}
		lines, err := reader.ReadAll()
		if err != nil {
			isdHistoryErr = err
			return
		}
		for _, i := range lines {
			if i[3] == "US" {
				lat, _ := strconv.ParseFloat(i[6], 64)
				long, _ := strconv.ParseFloat(i[7], 64)
				if !(long < -125.0 || long > -67 || lat > 49 || lat < 24) {
					row, col := gridCellFromLatLong(lat, long)
					stations[fmt.Sprintf("%s-%s", i[0], i[1])] = Station{lat: row, long: col}
				}
			}
		}
		isdHistoryData = stations
	})
	return isdHistoryData, isdHistoryErr
}

func parseGSODFloat(raw string, missing ...string) (float64, error) {
	cleaned := strings.TrimSpace(raw)
	cleaned = strings.TrimRightFunc(cleaned, func(r rune) bool {
		return (r < '0' || r > '9') && r != '.' && r != '-' && r != '+'
	})
	if cleaned == "" {
		return missingFloat, nil
	}
	for _, sentinel := range missing {
		if cleaned == sentinel {
			return missingFloat, nil
		}
	}
	value, err := strconv.ParseFloat(cleaned, 64)
	if err != nil {
		return 0, err
	}
	return value, nil
}

func isPresent(value float64) bool {
	return value != missingFloat
}
