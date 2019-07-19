package parse

import (
	"encoding/csv"
	"os"
	"strconv"
)

type totalWeather struct {
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

func parseWeather() {

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
