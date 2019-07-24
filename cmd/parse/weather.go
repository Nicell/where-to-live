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
	January   MonthWeather `json:"j"`
	February  MonthWeather `json:"f"`
	March     MonthWeather `json:"m"`
	April     MonthWeather `json:"a"`
	May       MonthWeather `json:"y"`
	June      MonthWeather `json:"u"`
	July      MonthWeather `json:"l"`
	August    MonthWeather `json:"g"`
	September MonthWeather `json:"s"`
	October   MonthWeather `json:"o"`
	November  MonthWeather `json:"n"`
	December  MonthWeather `json:"d"`
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
func BuildWeatherMap() ([50][116]Station, error) {
	allYears := [][50][116]Station{}
	for i := 1990; i < time.Now().Year(); i++ {
		fmt.Println(i)
		tmp, err := parseGSOD(i)
		if err != nil {
			return [50][116]Station{}, err
		}
		allYears = append(allYears, averageStations(tmp))
	}
	return averageYears(allYears), nil
}

//Averages all years of each station into one station at each US map location
func averageYears(years [][50][116]Station) [50][116]Station {
	avg := [50][116]Station{}
	for x, a := range years {
		for y, b := range a {
			for z := range b {
				avg[y][z].Weather.January.Good += years[x][y][z].Weather.January.Good
				avg[y][z].Weather.January.Bad += years[x][y][z].Weather.January.Bad
				if years[x][y][z].Weather.January.filled {
					avg[y][z].Weather.January.years++
				}

				avg[y][z].Weather.February.Good += years[x][y][z].Weather.February.Good
				avg[y][z].Weather.February.Bad += years[x][y][z].Weather.February.Bad
				if years[x][y][z].Weather.February.filled {
					avg[y][z].Weather.February.years++
				}

				avg[y][z].Weather.March.Good += years[x][y][z].Weather.March.Good
				avg[y][z].Weather.March.Bad += years[x][y][z].Weather.March.Bad
				if years[x][y][z].Weather.March.filled {
					avg[y][z].Weather.March.years++
				}

				avg[y][z].Weather.April.Good += years[x][y][z].Weather.April.Good
				avg[y][z].Weather.April.Bad += years[x][y][z].Weather.April.Bad
				if years[x][y][z].Weather.April.filled {
					avg[y][z].Weather.April.years++
				}

				avg[y][z].Weather.May.Good += years[x][y][z].Weather.May.Good
				avg[y][z].Weather.May.Bad += years[x][y][z].Weather.May.Bad
				if years[x][y][z].Weather.May.filled {
					avg[y][z].Weather.May.years++
				}

				avg[y][z].Weather.June.Good += years[x][y][z].Weather.June.Good
				avg[y][z].Weather.June.Bad += years[x][y][z].Weather.June.Bad
				if years[x][y][z].Weather.June.filled {
					avg[y][z].Weather.June.years++
				}

				avg[y][z].Weather.July.Good += years[x][y][z].Weather.July.Good
				avg[y][z].Weather.July.Bad += years[x][y][z].Weather.July.Bad
				if years[x][y][z].Weather.July.filled {
					avg[y][z].Weather.July.years++
				}

				avg[y][z].Weather.August.Good += years[x][y][z].Weather.August.Good
				avg[y][z].Weather.August.Bad += years[x][y][z].Weather.August.Bad
				if years[x][y][z].Weather.August.filled {
					avg[y][z].Weather.August.years++
				}

				avg[y][z].Weather.September.Good += years[x][y][z].Weather.September.Good
				avg[y][z].Weather.September.Bad += years[x][y][z].Weather.September.Bad
				if years[x][y][z].Weather.September.filled {
					avg[y][z].Weather.September.years++
				}

				avg[y][z].Weather.October.Good += years[x][y][z].Weather.October.Good
				avg[y][z].Weather.October.Bad += years[x][y][z].Weather.October.Bad
				if years[x][y][z].Weather.October.filled {
					avg[y][z].Weather.October.years++
				}

				avg[y][z].Weather.November.Good += years[x][y][z].Weather.November.Good
				avg[y][z].Weather.November.Bad += years[x][y][z].Weather.November.Bad
				if years[x][y][z].Weather.November.filled {
					avg[y][z].Weather.November.years++
				}

				avg[y][z].Weather.December.Good += years[x][y][z].Weather.December.Good
				avg[y][z].Weather.December.Bad += years[x][y][z].Weather.December.Bad
				if years[x][y][z].Weather.December.filled {
					avg[y][z].Weather.December.years++
				}
			}
		}
	}
	for x, a := range avg {
		for y, b := range a {
			if b.Weather.January.years == 0 {
				b.Weather.January.years = 1
			}
			avg[x][y].Weather.January.Good = float64(math.Round(b.Weather.January.Good / float64(b.Weather.January.years)))
			avg[x][y].Weather.January.Bad = float64(math.Round(b.Weather.January.Bad / float64(b.Weather.January.years)))

			if b.Weather.February.years == 0 {
				b.Weather.February.years = 1
			}
			avg[x][y].Weather.February.Good = float64(math.Round(b.Weather.February.Good / float64(b.Weather.February.years)))
			avg[x][y].Weather.February.Bad = float64(math.Round(b.Weather.February.Bad / float64(b.Weather.February.years)))

			if b.Weather.March.years == 0 {
				b.Weather.March.years = 1
			}
			avg[x][y].Weather.March.Good = float64(math.Round(b.Weather.March.Good / float64(b.Weather.March.years)))
			avg[x][y].Weather.March.Bad = float64(math.Round(b.Weather.March.Bad / float64(b.Weather.March.years)))

			if b.Weather.April.years == 0 {
				b.Weather.April.years = 1
			}
			avg[x][y].Weather.April.Good = float64(math.Round(b.Weather.April.Good / float64(b.Weather.April.years)))
			avg[x][y].Weather.April.Bad = float64(math.Round(b.Weather.April.Bad / float64(b.Weather.April.years)))

			if b.Weather.May.years == 0 {
				b.Weather.May.years = 1
			}
			avg[x][y].Weather.May.Good = float64(math.Round(b.Weather.May.Good / float64(b.Weather.May.years)))
			avg[x][y].Weather.May.Bad = float64(math.Round(b.Weather.May.Bad / float64(b.Weather.May.years)))

			if b.Weather.June.years == 0 {
				b.Weather.June.years = 1
			}
			avg[x][y].Weather.June.Good = float64(math.Round(b.Weather.June.Good / float64(b.Weather.June.years)))
			avg[x][y].Weather.June.Bad = float64(math.Round(b.Weather.June.Bad / float64(b.Weather.June.years)))

			if b.Weather.July.years == 0 {
				b.Weather.July.years = 1
			}
			avg[x][y].Weather.July.Good = float64(math.Round(b.Weather.July.Good / float64(b.Weather.July.years)))
			avg[x][y].Weather.July.Bad = float64(math.Round(b.Weather.July.Bad / float64(b.Weather.July.years)))

			if b.Weather.August.years == 0 {
				b.Weather.August.years = 1
			}
			avg[x][y].Weather.August.Good = float64(math.Round(b.Weather.August.Good / float64(b.Weather.August.years)))
			avg[x][y].Weather.August.Bad = float64(math.Round(b.Weather.August.Bad / float64(b.Weather.August.years)))

			if b.Weather.September.years == 0 {
				b.Weather.September.years = 1
			}
			avg[x][y].Weather.September.Good = float64(math.Round(b.Weather.September.Good / float64(b.Weather.September.years)))
			avg[x][y].Weather.September.Bad = float64(math.Round(b.Weather.September.Bad / float64(b.Weather.September.years)))

			if b.Weather.October.years == 0 {
				b.Weather.October.years = 1
			}
			avg[x][y].Weather.October.Good = float64(math.Round(b.Weather.October.Good / float64(b.Weather.October.years)))
			avg[x][y].Weather.October.Bad = float64(math.Round(b.Weather.October.Bad / float64(b.Weather.October.years)))

			if b.Weather.November.years == 0 {
				b.Weather.November.years = 1
			}
			avg[x][y].Weather.November.Good = float64(math.Round(b.Weather.November.Good / float64(b.Weather.November.years)))
			avg[x][y].Weather.November.Bad = float64(math.Round(b.Weather.November.Bad / float64(b.Weather.November.years)))

			if b.Weather.December.years == 0 {
				b.Weather.December.years = 1
			}
			avg[x][y].Weather.December.Good = float64(math.Round(b.Weather.December.Good / float64(b.Weather.December.years)))
			avg[x][y].Weather.December.Bad = float64(math.Round(b.Weather.December.Bad / float64(b.Weather.December.years)))
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
			if station == (Station{}) {
				continue
			}
			data, err := processLine(line)
			if err != nil {
				return weatherMap, err
			}
			j := &station
			processDay(j, data)
		}
		if station.Weather.totalDays >= 150 {
			weatherMap[station.lat][station.long] = append(weatherMap[station.lat][station.long], station)
		}
	}
}

//Averages all stations in one location of the US map
func averageStations(in [50][116][]Station) [50][116]Station {
	out := [50][116]Station{}
	t := TotalWeather{}
	for x, a := range in {
		for y, b := range a {
			t = TotalWeather{}
			for _, c := range b {
				if c != (Station{}) {
					t.totalDays += c.Weather.totalDays
					t.January.total += c.Weather.January.total
					t.January.Good += c.Weather.January.Good
					t.January.Bad += c.Weather.January.Bad

					t.February.total += c.Weather.February.total
					t.February.Good += c.Weather.February.Good
					t.February.Bad += c.Weather.February.Bad

					t.March.total += c.Weather.March.total
					t.March.Good += c.Weather.March.Good
					t.March.Bad += c.Weather.March.Bad

					t.April.total += c.Weather.April.total
					t.April.Good += c.Weather.April.Good
					t.April.Bad += c.Weather.April.Bad

					t.May.total += c.Weather.May.total
					t.May.Good += c.Weather.May.Good
					t.May.Bad += c.Weather.May.Bad

					t.June.total += c.Weather.June.total
					t.June.Good += c.Weather.June.Good
					t.June.Bad += c.Weather.June.Bad

					t.July.total += c.Weather.July.total
					t.July.Good += c.Weather.July.Good
					t.July.Bad += c.Weather.July.Bad

					t.August.total += c.Weather.August.total
					t.August.Good += c.Weather.August.Good
					t.August.Bad += c.Weather.August.Bad

					t.September.total += c.Weather.September.total
					t.September.Good += c.Weather.September.Good
					t.September.Bad += c.Weather.September.Bad

					t.October.total += c.Weather.October.total
					t.October.Good += c.Weather.October.Good
					t.October.Bad += c.Weather.October.Bad

					t.November.total += c.Weather.November.total
					t.November.Good += c.Weather.November.Good
					t.November.Bad += c.Weather.November.Bad

					t.December.total += c.Weather.December.total
					t.December.Good += c.Weather.December.Good
					t.December.Bad += c.Weather.December.Bad
				}
			}
			if t != (TotalWeather{}) {
				if t.January.total != 0 {
					t.January.Good = (t.January.Good / float64(t.January.total)) * 31
					t.January.Bad = (t.January.Bad / float64(t.January.total)) * 31
					t.January.filled = true
				}
				if t.February.total != 0 {
					t.February.Good = (t.February.Good / float64(t.February.total)) * 28
					t.February.Bad = (t.February.Bad / float64(t.February.total)) * 28
					t.February.filled = true
				}
				if t.March.total != 0 {
					t.March.Good = (t.March.Good / float64(t.March.total)) * 31
					t.March.Bad = (t.March.Bad / float64(t.March.total)) * 31
					t.March.filled = true
				}
				if t.April.total != 0 {
					t.April.Good = (t.April.Good / float64(t.April.total)) * 30
					t.April.Bad = (t.April.Bad / float64(t.April.total)) * 30
					t.April.filled = true
				}
				if t.May.total != 0 {
					t.May.Good = (t.May.Good / float64(t.May.total)) * 31
					t.May.Bad = (t.May.Bad / float64(t.May.total)) * 31
					t.May.filled = true
				}
				if t.June.total != 0 {
					t.June.Good = (t.June.Good / float64(t.June.total)) * 30
					t.June.Bad = (t.June.Bad / float64(t.June.total)) * 30
					t.June.filled = true
				}
				if t.July.total != 0 {
					t.July.Good = (t.July.Good / float64(t.July.total)) * 31
					t.July.Bad = (t.July.Bad / float64(t.July.total)) * 31
					t.July.filled = true
				}
				if t.August.total != 0 {
					t.August.Good = (t.August.Good / float64(t.August.total)) * 31
					t.August.Bad = (t.August.Bad / float64(t.August.total)) * 31
					t.August.filled = true
				}
				if t.September.total != 0 {
					t.September.Good = (t.September.Good / float64(t.September.total)) * 30
					t.September.Bad = (t.September.Bad / float64(t.September.total)) * 30
					t.September.filled = true
				}
				if t.October.total != 0 {
					t.October.Good = (t.October.Good / float64(t.October.total)) * 31
					t.October.Bad = (t.October.Bad / float64(t.October.total)) * 31
					t.October.filled = true
				}
				if t.November.total != 0 {
					t.November.Good = (t.November.Good / float64(t.November.total)) * 30
					t.November.Bad = (t.November.Bad / float64(t.November.total)) * 30
					t.November.filled = true
				}
				if t.December.total != 0 {
					t.December.Good = (t.December.Good / float64(t.December.total)) * 31
					t.December.Bad = (t.December.Bad / float64(t.December.total)) * 31
					t.December.filled = true
				}
				out[x][y] = Station{lat: x, long: y, Weather: t}
			}
		}
	}
	return out
}

//Takes in one day of weather and stores it to the station provided
func processDay(station *Station, day weatherData) {
	if day.precip > 0.1 || day.minTemp < 40 || day.maxTemp > 85 || day.visib < 5 || day.harshWeather > 0 {
		switch day.date.Month() {
		case time.January:
			station.Weather.January.Bad++
			station.Weather.January.total++
		case time.February:
			station.Weather.February.Bad++
			station.Weather.February.total++
		case time.March:
			station.Weather.March.Bad++
			station.Weather.March.total++
		case time.April:
			station.Weather.April.Bad++
			station.Weather.April.total++
		case time.May:
			station.Weather.May.Bad++
			station.Weather.May.total++
		case time.June:
			station.Weather.June.Bad++
			station.Weather.June.total++
		case time.July:
			station.Weather.July.Bad++
			station.Weather.July.total++
		case time.August:
			station.Weather.August.Bad++
			station.Weather.August.total++
		case time.September:
			station.Weather.September.Bad++
			station.Weather.September.total++
		case time.October:
			station.Weather.October.Bad++
			station.Weather.October.total++
		case time.November:
			station.Weather.November.Bad++
			station.Weather.November.total++
		case time.December:
			station.Weather.December.Bad++
			station.Weather.December.total++
		}
	} else if day.avgTemp > 65 && day.avgTemp < 75 && day.visib > 5 && day.maxTemp < 85 && day.minTemp > 55 && day.precip < .05 && day.harshWeather == 0 {
		switch day.date.Month() {
		case time.January:
			station.Weather.January.Good++
			station.Weather.January.total++
		case time.February:
			station.Weather.February.Good++
			station.Weather.February.total++
		case time.March:
			station.Weather.March.Good++
			station.Weather.March.total++
		case time.April:
			station.Weather.April.Good++
			station.Weather.April.total++
		case time.May:
			station.Weather.May.Good++
			station.Weather.May.total++
		case time.June:
			station.Weather.June.Good++
			station.Weather.June.total++
		case time.July:
			station.Weather.July.Good++
			station.Weather.July.total++
		case time.August:
			station.Weather.August.Good++
			station.Weather.August.total++
		case time.September:
			station.Weather.September.Good++
			station.Weather.September.total++
		case time.October:
			station.Weather.October.Good++
			station.Weather.October.total++
		case time.November:
			station.Weather.November.Good++
			station.Weather.November.total++
		case time.December:
			station.Weather.December.Good++
			station.Weather.December.total++
		}
	} else {
		switch day.date.Month() {
		case time.January:
			station.Weather.January.total++
		case time.February:
			station.Weather.February.total++
		case time.March:
			station.Weather.March.total++
		case time.April:
			station.Weather.April.total++
		case time.May:
			station.Weather.May.total++
		case time.June:
			station.Weather.June.total++
		case time.July:
			station.Weather.July.total++
		case time.August:
			station.Weather.August.total++
		case time.September:
			station.Weather.September.total++
		case time.October:
			station.Weather.October.total++
		case time.November:
			station.Weather.November.total++
		case time.December:
			station.Weather.December.total++
		}
	}
	station.Weather.totalDays++
}

//Takes in a line of GSOD data and converts it to a weatherData struct
func processLine(line string) (weatherData, error) {
	data := weatherData{}
	year, err := strconv.ParseInt(line[14:18], 10, 32)
	if err != nil {
		return weatherData{}, err
	}
	month, err := strconv.ParseInt(line[18:20], 10, 32)
	if err != nil {
		return weatherData{}, err
	}
	day, err := strconv.ParseInt(line[20:22], 10, 32)
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
