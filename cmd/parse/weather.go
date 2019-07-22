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
	january   monthWeather
	february  monthWeather
	march     monthWeather
	april     monthWeather
	may       monthWeather
	june      monthWeather
	july      monthWeather
	august    monthWeather
	september monthWeather
	october   monthWeather
	november  monthWeather
	december  monthWeather
}
type monthWeather struct {
	good int
	bad  int
}

type location struct {
	lat     int
	long    int
	weather TotalWeather
}

type weatherData struct {
	station                                                               string
	visib, minTemp, maxTemp, precip, avgTemp, wind, maxWind, harshWeather float64
	date                                                                  time.Time
}

func parseGSOD(year int) (map[string]location, error) {
	count := 0
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
		if err != nil {
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
			if station == (location{}) {
				continue
			}
			data, err := processLine(line)
			if err != nil {
				return stations, err
			}
			j := &station
			count++
			fmt.Print(count)
			fmt.Println(station.weather)
			processDay(j, data)
			fmt.Println(station.weather)
			stations[toStationId(line)] = station
		}
	}
}

func processDay(station *location, day weatherData) {
	if day.precip > 0.1 || day.minTemp < 40 || day.maxTemp > 85 || day.visib < 5 || day.harshWeather > 0 {
		switch day.date.Month() {
		case time.January:
			station.weather.january.bad++
		case time.February:
			station.weather.february.bad++
		case time.March:
			station.weather.march.bad++
		case time.April:
			station.weather.april.bad++
		case time.May:
			station.weather.may.bad++
		case time.June:
			station.weather.june.bad++
		case time.July:
			station.weather.july.bad++
		case time.August:
			station.weather.august.bad++
		case time.September:
			station.weather.september.bad++
		case time.October:
			station.weather.october.bad++
		case time.November:
			station.weather.november.bad++
		case time.December:
			station.weather.december.bad++
		}
	} else {
		switch day.date.Month() {
		case time.January:
			station.weather.january.good++
		case time.February:
			station.weather.february.good++
		case time.March:
			station.weather.march.good++
		case time.April:
			station.weather.april.good++
		case time.May:
			station.weather.may.good++
		case time.June:
			station.weather.june.good++
		case time.July:
			station.weather.july.good++
		case time.August:
			station.weather.august.good++
		case time.September:
			station.weather.september.good++
		case time.October:
			station.weather.october.good++
		case time.November:
			station.weather.november.good++
		case time.December:
			station.weather.december.good++
		}
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

func parseISDHistory() (map[string]location, error) {
	stations := make(map[string]location)
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
				stations[i[0]] = location{lat: latConvert(lat), long: longConvert(long)}
			}
		}
	}
	return stations, nil
}
