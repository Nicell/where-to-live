package parse

import (
	"encoding/csv"
	"math"
	"os"
	"strconv"
	"strings"
)

//Zip a struct that stores the Zipcode, lat, long, and Name of a Station
type Zip struct {
	Zipcode string `json:"z"`
	lat     string
	long    string
	Name    string `json:"n"`
	State   string `json:"s"`
}

//Parses the states.csv and builds a map with number (as a string) keys and abbreviations (WI, CA, CO, etc.) as value
func parseState() (map[string]string, error) {
	states := make(map[string]string)
	file, err := os.Open("data/states.csv")
	if err != nil {
		return states, err
	}
	defer file.Close()
	lines, err := csv.NewReader(file).ReadAll()
	if err != nil {
		return states, err
	}
	for _, i := range lines {
		states[i[2]] = i[1]
	}
	return states, nil
}

//parses the zips.tsv file
func parseZip() ([]Zip, error) {
	file, err := os.Open("data/zips.tsv")
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = '\t' //CSV reader uses tabs instead of commas
	lines, err := reader.ReadAll()
	if err != nil {
		panic(err)
	}
	zips := []Zip{}
	states, err := parseState()
	if err != nil {
		return zips, err
	}
	for _, i := range lines {
		data := Zip{
			Zipcode: i[0],
			lat:     i[1],
			long:    i[2],
			Name:    i[4],
			State:   states[strings.TrimPrefix(i[5], "0")],
		}
		long, _ := strconv.ParseFloat(data.long, 64)
		lat, _ := strconv.ParseFloat(data.lat, 64)
		if !(long < -125.0 || long > -67 || lat > 50 || lat < 24) {
			zips = append(zips, data)
		}
	}
	return zips, err
}

//Parses population-by-Zip.csv to put into a map with keys of Zip codes
func parsePopulation() (map[string]int, error) {
	pop := make(map[string]int)
	file, err := os.Open("data/population-by-Zip.csv")
	if err != nil {
		return pop, err
	}
	defer file.Close()
	reader := csv.NewReader(file)
	_, err = reader.Read() //ignores column header
	if err != nil {
		return pop, err
	}
	lines, err := reader.ReadAll()
	if err != nil {
		return pop, err
	}
	for _, i := range lines {
		k, err := strconv.ParseInt(i[1], 10, 32)
		if err != nil {
			return pop, err
		}
		pop[i[0]] = int(k)
	}
	return pop, nil
}

//Maps all Zip codes to a grid stacking overlapping counties
func makeMap() ([52][116][]Zip, error) {
	mapUS := [52][116][]Zip{}
	zips, err := parseZip()
	if err != nil {
		return mapUS, err
	}
	namePop, err := parsePopulation()
	if err != nil {
		return mapUS, err
	}
	for _, i := range zips {
		j, err := strconv.ParseFloat(i.lat, 64)
		if err != nil {
			return mapUS, err
		}
		k, err := strconv.ParseFloat(i.long, 64)
		if err != nil {
			return mapUS, err
		}
		if len(mapUS[latConvert(j)][longConvert(k)]) != 0 {
			if namePop[mapUS[latConvert(j)][longConvert(k)][0].State+"."+mapUS[latConvert(j)][longConvert(k)][0].Name] < namePop[i.State+"."+i.Name] {
				mapUS[latConvert(j)][longConvert(k)] = append([]Zip{i}, mapUS[latConvert(j)][longConvert(k)]...)
			} else {
				mapUS[latConvert(j)][longConvert(k)] = append(mapUS[latConvert(j)][longConvert(k)], i)
			}
		} else {
			mapUS[latConvert(j)][longConvert(k)] = append(mapUS[latConvert(j)][longConvert(k)], i)
		}
	}
	return mapUS, err
}

//Converts a latitude to fit into the grid
func latConvert(lat float64) int {
	t := 51 - (math.Round(lat/.5) - 49)
	return int(t)
}

//Converts a longitude value to fit into the grid
func longConvert(long float64) int {
	long = math.Abs(long)
	long -= 9
	t := 115 - (math.Floor(long/.5) - 116)
	return int(t)
}
