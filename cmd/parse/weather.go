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
	"strconv"
	"strings"
	"time"
)

//TotalWeather All the weather for a year
type TotalWeather struct {
	Months    map[string]MonthWeather `json:"m"`
	totalDays int
}

//MonthWeather All the data for the entire month is condensed down to MonthWeather
type MonthWeather struct {
	Good   float64 `json:"g"`
	Bad    float64 `json:"b"`
	total  int
	years  int
	filled bool
}

//Station Contains one station with weather and location
type Station struct {
	lat     int
	long    int
	Weather TotalWeather `json:"w"`
}

//Contains one day of weather information
type weatherData struct {
	station                                                               string
	visib, minTemp, maxTemp, precip, avgTemp, wind, maxWind, harshWeather float64
	date                                                                  time.Time
}

//BuildWeatherMap Builds the weather map
func buildWeatherMap() ([50][116]Station, error) {
	allYears := [][50][116]Station{}
	for i := 1990; i < time.Now().Year(); i++ {
		fmt.Println(i)
		tmp, err := parseGSOD(i)
		if err != nil {
			return [50][116]Station{}, err
		}
		i, err := averageStations(tmp)
		if err != nil {
			return [50][116]Station{}, err
		}
		allYears = append(allYears, i)
	}
	return averageYears(allYears), nil
}

//Averages all years of each station into one station at each US map location
func averageYears(years [][50][116]Station) [50][116]Station {
	avg := [50][116]Station{}
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

//Reads through a single GSOD file for the year and returns stations at each location
func parseGSOD(year int) ([50][116][]Station, error) {
	filepath := fmt.Sprintf("data/gsod_%d.tar", year)
	stations, _ := parseISDHistory()
	weatherMap := [50][116][]Station{}
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
		station := Station{lat: -1, long: -1, Weather: TotalWeather{}}
		station.Weather.Months = make(map[string]MonthWeather)
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
				tempStation := stations[toStationId(line)]
				station.lat = tempStation.lat
				station.long = tempStation.long
			}
			if &station == nil {
				continue
			}
			data, err := processLine(line)
			if err != nil {
				return weatherMap, err
			}
			j := &station
			processDay(j, data)
		}
		if station.Weather.totalDays >= 330 {
			weatherMap[station.lat][station.long] = append(weatherMap[station.lat][station.long], station)
		}
	}
}

//Averages all stations in one location of the US map
func averageStations(in [50][116][]Station) ([50][116]Station, error) {
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
	out := [50][116]Station{}
	zips, err := makeMap()
	if err != nil {
		return out, err
	}
	t := TotalWeather{}
	in2 := in
	for x, a := range in {
		for y, b := range a {
			if len(b) < 4 {
				if len(zips[x][y]) > 0 {
					b = addStations(in2, x, y)
				}
			}
			t = TotalWeather{}
			t.Months = make(map[string]MonthWeather)
			for _, c := range b {
				if &c != nil {
					t.totalDays += c.Weather.totalDays
					for k, a := range c.Weather.Months {
						d := t.Months[k]
						d.total += a.total
						d.Good += a.Good
						d.Bad += a.Bad
						t.Months[k] = d
					}
				}
			}
			if &t != nil {
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
	}
	return out, nil
}

func addStations(in [50][116][]Station, lat, long int) []Station {
	s := in[lat][long]
	radius := 1
	for len(s) < 4 {
		latGrid := lat - radius
		longGrid := long - radius
		for a := latGrid; a < (2*radius + 1); a++ {
			for b := longGrid; b < (2*radius + 1); b++ {
				if a >= 0 && b >= 0 && a < 50 && b < 116 {
					if len(in[a][b]) > 0 {
						s = append(s, in[a][b]...)
					}
				}
			}
		}
		radius++
	}
	return s
}

//Takes in one day of weather and stores it to the station provided
func processDay(station *Station, day weatherData) {
	t := MonthWeather{}
	if day.precip > 0.1 || day.minTemp < 40 || day.maxTemp > 90 || day.visib < 5 || day.harshWeather > 0 {
		t.Bad++
	} else if day.avgTemp > 60 && day.avgTemp < 80 && day.visib > 5 && day.maxTemp < 85 && day.minTemp > 50 && day.precip < .05 && day.harshWeather == 0 {
		t.Good++
	}
	t.total++
	station.Weather.Months[day.date.Month().String()] = t
	station.Weather.totalDays++
}

//Takes in a line of GSOD data and converts it to a weatherData struct
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

	tmp, err := strconv.ParseFloat(strings.TrimSpace(line[78:83]), 64)
	if err != nil {
		return weatherData{}, err
	}
	data.wind = tmp

	tmp, err = strconv.ParseFloat(strings.TrimSpace(line[88:93]), 64)
	if err != nil {
		return weatherData{}, err
	}
	data.maxWind = tmp

	tmp, err = strconv.ParseFloat(strings.TrimSpace(line[24:30]), 64)
	if err != nil {
		return weatherData{}, err
	}
	if tmp > 80 {
		dewpoint, err := strconv.ParseFloat(strings.TrimSpace(line[35:40]), 64)
		if err != nil {
			return weatherData{}, err
		}
		if dewpoint > 40 {
			calcHeatIndex(&tmp, calcRelativeHumidity(tmp, dewpoint))
		}
	} else if tmp < 50 && (data.wind*1.15078) > 3 {
		calcWindChill(&tmp, data.wind)
	}
	data.avgTemp = tmp

	tmp, err = strconv.ParseFloat(strings.TrimSpace(line[102:108]), 64)
	if err != nil {
		return weatherData{}, err
	}
	data.maxTemp = tmp

	tmp, err = strconv.ParseFloat(strings.TrimSpace(line[110:116]), 64)
	if err != nil {
		return weatherData{}, err
	}
	data.minTemp = tmp

	tmp, err = strconv.ParseFloat(strings.TrimSpace(line[118:123]), 64)
	if err != nil {
		return weatherData{}, err
	}
	data.precip = tmp

	tmp, err = strconv.ParseFloat(strings.TrimSpace(line[68:72]), 64)
	if err != nil {
		return weatherData{}, err
	}
	data.visib = tmp

	l, err := strconv.ParseFloat(strings.TrimSpace(line[134:]), 64)
	if err != nil {
		return weatherData{}, err
	}
	data.harshWeather = l

	return data, nil
}

//Calculates the windchill taken in a temp and the windspeed - used equation as defined on https://www.weather.gov/media/epz/wxcalc/windChill.pdf
func calcWindChill(temp *float64, wind float64) {
	wind *= 1.15078
	*temp = (((*temp * 0.6215) + 35.74) - (35.75 * math.Pow(wind, 0.16))) + (.4275 * *temp * math.Pow(wind, 0.16))
}

//Calculates the heat index taken in a temp and the humidity - used equation as defined on https://www.weather.gov/media/epz/wxcalc/heatIndex.pdf
func calcHeatIndex(temp *float64, humidity float64) {
	*temp = -42.379 + (2.04901523 * *temp) + (10.14333127 * humidity) - (0.22475541 * *temp * humidity) - (6.83783 * 0.001 * math.Pow(*temp, 2)) - (5.481717 * 0.01 * math.Pow(humidity, 2)) + (1.22874 * .001 * math.Pow(*temp, 2) * humidity) + (8.5282 * 0.0001 * *temp * math.Pow(humidity, 2)) - (1.99 * 0.000001 * math.Pow(*temp, 2) * math.Pow(humidity, 2))
}

//Calculates and returns the relative humidity given the temp and dewpoint - using http://bmcnoldy.rsmas.miami.edu/Humidity.html
func calcRelativeHumidity(temp, dewpoint float64) float64 {
	ftoC(&temp)
	ftoC(&dewpoint)
	return 100 * (math.Exp((17.625*dewpoint)/(243.04+dewpoint)) / math.Exp((17.625*temp)/(243.04+temp)))
}

//Converts fahrenheit to celsius
func ftoC(temp *float64) {
	*temp = (*temp - 32) * (5 / 9)
}

//Takes in a line of gsod data and returns the station corresponding to that line
func toStationId(l string) string {
	return fmt.Sprintf("%s", l[0:6])
}

//returns a map that has station id as keys and the station data as values
func parseISDHistory() (map[string]Station, error) {
	stations := make(map[string]Station)
	file, err := os.Open("data/isd-history.csv")
	if err != nil {
		return stations, err
	}
	reader := csv.NewReader(file)
	_, err = reader.Read() //skip the title line
	if err != nil {
		return stations, err
	}
	lines, err := reader.ReadAll()
	if err != nil {
		return stations, err
	}
	for _, i := range lines {
		if i[3] == "US" {
			lat, _ := strconv.ParseFloat(i[6], 64)
			long, _ := strconv.ParseFloat(i[7], 64)
			if !(long < -125.0 || long > -67 || lat > 49 || lat < 24) {
				stations[i[0]] = Station{lat: latConvert(lat), long: longConvert(long)}
			}
		}
	}
	return stations, nil
}
