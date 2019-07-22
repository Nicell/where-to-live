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
	lat  int
	long int
}

type weatherData struct {
	station                                                 location
	visib, minTemp, maxTemp, precip, avgTemp, wind, maxWind float64
	harshWeather                                            string
	date                                                    time.Time
}

func ParseGSOD(year int) ([]weatherData, error) {
	filepath := fmt.Sprintf("data/gsod_%d.tar", year)
	s := []weatherData{}
	stations, _ := parseISDHistory()
	file, err := os.Open(filepath)
	if err != nil {
		return s, err
	}
	defer file.Close()
	tarReader := tar.NewReader(file)
	var buffer bytes.Buffer
	for {
		nextfile, err := tarReader.Next()
		if err != nil {
			return s, err
		}
		if nextfile.FileInfo().IsDir() {
			continue
		}

		gzipF, err := gzip.NewReader(tarReader)
		if err != nil {
			return s, err
		}
		opReader := bufio.NewReader(gzipF)
		for {
			in, prefix, err := opReader.ReadLine()
			if err == io.EOF {
				break
			} else if err != nil {
				return s, err
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
			tmp, err := processLine(line, station)
			if err != nil {
				return s, err
			}
			s = append(s, tmp)
		}
	}
}

func processLine(line string, station location) (weatherData, error) {
	data := weatherData{}
	data.station = station
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

	l := strings.TrimSpace(line[132:])
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
