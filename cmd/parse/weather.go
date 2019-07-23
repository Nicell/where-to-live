package parse

import (
	"archive/tar"
	"bufio"
	"bytes"
	"compress/gzip"
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"time"
)

type TotalWeather struct {
	January   MonthWeather
	February  MonthWeather
	March     MonthWeather
	April     MonthWeather
	May       MonthWeather
	June      MonthWeather
	July      MonthWeather
	August    MonthWeather
	September MonthWeather
	October   MonthWeather
	November  MonthWeather
	December  MonthWeather
	totalDays int
}
type MonthWeather struct {
	Good  float64
	Bad   float64
	total int
}

type Station struct {
	lat     int
	long    int
	Weather TotalWeather
}
type weatherData struct {
	station                                                               string
	visib, minTemp, maxTemp, precip, avgTemp, wind, maxWind, harshWeather float64
	date                                                                  time.Time
}

func ParseGSOD(year int) ([52][116][]Station, error) {

	filepath := fmt.Sprintf("data/gsod_%d.tar", year)
	stations, _ := parseISDHistory()
	weatherMap := [52][116][]Station{}
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
		station := Station{-1, -1, TotalWeather{}}
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

func AverageStations(in [52][116][]Station) [52][116]Station {
	out := [52][116]Station{}
	t := TotalWeather{}
	for x, a := range in {
		for y, b := range a {
			for _, c := range b {
				if c != (Station{}) {
					t = TotalWeather{}
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
				}
				if t.February.total != 0 {
					t.February.Good = (t.February.Good / float64(t.February.total)) * 28
					t.February.Bad = (t.February.Bad / float64(t.February.total)) * 28
				}
				if t.March.total != 0 {
					t.March.Good = (t.March.Good / float64(t.March.total)) * 31
					t.March.Bad = (t.March.Bad / float64(t.March.total)) * 31
				}
				if t.April.total != 0 {
					t.April.Good = (t.April.Good / float64(t.April.total)) * 30
					t.April.Bad = (t.April.Bad / float64(t.April.total)) * 30
				}
				if t.May.total != 0 {
					t.May.Good = (t.May.Good / float64(t.May.total)) * 31
					t.May.Bad = (t.May.Bad / float64(t.May.total)) * 31
				}
				if t.June.total != 0 {
					t.June.Good = (t.June.Good / float64(t.June.total)) * 30
					t.June.Bad = (t.June.Bad / float64(t.June.total)) * 30
				}
				if t.July.total != 0 {
					t.July.Good = (t.July.Good / float64(t.July.total)) * 31
					t.July.Bad = (t.July.Bad / float64(t.July.total)) * 31
				}
				if t.August.total != 0 {
					t.August.Good = (t.August.Good / float64(t.August.total)) * 31
					t.August.Bad = (t.August.Bad / float64(t.August.total)) * 31
				}
				if t.September.total != 0 {
					t.September.Good = (t.September.Good / float64(t.September.total)) * 30
					t.September.Bad = (t.September.Bad / float64(t.September.total)) * 30
				}
				if t.October.total != 0 {
					t.October.Good = (t.October.Good / float64(t.October.total)) * 31
					t.October.Bad = (t.October.Bad / float64(t.October.total)) * 31
				}
				if t.November.total != 0 {
					t.November.Good = (t.November.Good / float64(t.November.total)) * 30
					t.November.Bad = (t.November.Bad / float64(t.November.total)) * 30
				}
				if t.December.total != 0 {
					t.December.Good = (t.December.Good / float64(t.December.total)) * 31
					t.December.Bad = (t.December.Bad / float64(t.December.total)) * 31
				}
				out[x][y] = Station{x, y, t}
			}
		}
	}
	return out
}

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

func toStationId(l string) string {
	return fmt.Sprintf("%s", l[0:6])
}

func parseISDHistory() (map[string]Station, error) {
	stations := make(map[string]Station)
	file, err := os.Open("data/isd-history.csv")
	if err != nil {
		return stations, err
	}
	reader := csv.NewReader(file)
	reader.Read() //skip the title line
	lines, err := reader.ReadAll()
	for _, i := range lines {
		if i[3] == "US" {
			lat, _ := strconv.ParseFloat(i[6], 64)
			long, _ := strconv.ParseFloat(i[7], 64)
			if !(long < -125.0 || long > -67 || lat > 50 || lat < 24) {
				stations[i[0]] = Station{lat: latConvert(lat), long: longConvert(long)}
			}
		}
	}
	return stations, nil
}
