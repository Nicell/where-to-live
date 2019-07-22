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
}
type MonthWeather struct {
	Good int
	Bad  int
}

type Location struct {
	lat     int
	long    int
	Weather TotalWeather
}

type weatherData struct {
	station                                                               string
	visib, minTemp, maxTemp, precip, avgTemp, wind, maxWind, harshWeather float64
	date                                                                  time.Time
}

func parseGSOD(year int) (map[string]Location, error) {
	filepath := fmt.Sprintf("data/gsod_%d.tar", year)
	stations, _ := parseISDHistory()
	file, err := os.Open(filepath)
	if err != nil {
		return stations, err
	}
	defer file.Close()
	tarReader := tar.NewReader(file)
	var buffer bytes.Buffer
	for {
		nextfile, err := tarReader.Next()
		if err == io.EOF {
			return stations, nil
		} else if err != nil {
			return stations, err
		}
		if nextfile.FileInfo().IsDir() {
			continue
		}

		gzipF, err := gzip.NewReader(tarReader)
		if err != nil {
			return stations, err
		}
		opReader := bufio.NewReader(gzipF)
		for {
			in, prefix, err := opReader.ReadLine()
			if err == io.EOF {
				break
			} else if err != nil {
				return stations, err
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

			station := stations[toStationId(line)]
			if station == (Location{}) {
				continue
			}
			data, err := processLine(line)
			if err != nil {
				return stations, err
			}
			j := &station
			processDay(j, data)
			stations[toStationId(line)] = station
		}
	}
}

func processDay(station *Location, day weatherData) {
	if day.precip > 0.1 || day.minTemp < 40 || day.maxTemp > 85 || day.visib < 5 || day.harshWeather > 0 {
		switch day.date.Month() {
		case time.January:
			station.Weather.January.Bad++
		case time.February:
			station.Weather.February.Bad++
		case time.March:
			station.Weather.March.Bad++
		case time.April:
			station.Weather.April.Bad++
		case time.May:
			station.Weather.May.Bad++
		case time.June:
			station.Weather.June.Bad++
		case time.July:
			station.Weather.July.Bad++
		case time.August:
			station.Weather.August.Bad++
		case time.September:
			station.Weather.September.Bad++
		case time.October:
			station.Weather.October.Bad++
		case time.November:
			station.Weather.November.Bad++
		case time.December:
			station.Weather.December.Bad++
		}
	} else if day.avgTemp > 65 && day.avgTemp < 75 && day.visib > 5 && day.maxTemp < 85 && day.minTemp > 55 && day.precip < .05 && day.harshWeather == 0 {
		switch day.date.Month() {
		case time.January:
			station.Weather.January.Good++
		case time.February:
			station.Weather.February.Good++
		case time.March:
			station.Weather.March.Good++
		case time.April:
			station.Weather.April.Good++
		case time.May:
			station.Weather.May.Good++
		case time.June:
			station.Weather.June.Good++
		case time.July:
			station.Weather.July.Good++
		case time.August:
			station.Weather.August.Good++
		case time.September:
			station.Weather.September.Good++
		case time.October:
			station.Weather.October.Good++
		case time.November:
			station.Weather.November.Good++
		case time.December:
			station.Weather.December.Good++
		}
	} else {

	}
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

func parseISDHistory() (map[string]Location, error) {
	stations := make(map[string]Location)
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
				stations[i[0]] = Location{lat: latConvert(lat), long: longConvert(long)}
			}
		}
	}
	return stations, nil
}
