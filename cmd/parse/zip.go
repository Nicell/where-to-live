package parse

import (
	"encoding/csv"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

//zip a struct that stores the zipcode, lat, long, and name of a Station
type zip struct {
	zipcode string
	lat     string
	long    string
	name    string
	state   string
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
func parseZip() ([]zip, error) {
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
	zips := []zip{}
	states, err := parseState()
	if err != nil {
		return zips, err
	}
	for _, i := range lines {
		data := zip{
			zipcode: i[0],
			lat:     i[1],
			long:    i[2],
			name:    i[4],
			state:   states[strings.TrimPrefix(i[5], "0")],
		}
		long, _ := strconv.ParseFloat(data.long, 64)
		lat, _ := strconv.ParseFloat(data.lat, 64)
		if !(long < -125.0 || long > -67 || lat > 49 || lat < 24) {
			zips = append(zips, data)
		}
	}
	return zips, err
}

//Parses population-by-zip.csv to put into a map with keys of zip codes
func parsePopulation() (map[string]int, error) {
	pop := make(map[string]int)
	file, err := os.Open("data/population-by-zip.csv")
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

//Maps all zip codes to a grid stacking overlapping counties
func makeMap() ([50][116][]zip, error) {
	mapUS := [50][116][]zip{}
	zips, err := parseZip()
	if err != nil {
		return mapUS, err
	}
	namePop, err := nameToPop()
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
			if namePop[mapUS[latConvert(j)][longConvert(k)][0].state+"."+mapUS[latConvert(j)][longConvert(k)][0].name] < namePop[i.state+"."+i.name] {
				mapUS[latConvert(j)][longConvert(k)] = append([]zip{i}, mapUS[latConvert(j)][longConvert(k)]...)
			} else {
				mapUS[latConvert(j)][longConvert(k)] = append(mapUS[latConvert(j)][longConvert(k)], i)
			}
		} else {
			mapUS[latConvert(j)][longConvert(k)] = append(mapUS[latConvert(j)][longConvert(k)], i)
		}
	}
	return fillDeadSpace(mapUS)
}

func nameToPop() (map[string]int, error) {
	names := make(map[string]int)
	zipPop, err := parsePopulation()
	if err != nil {
		return names, err
	}
	zips, err := parseZip()
	if err != nil {
		return names, err
	}
	for _, a := range zips {
		names[a.state+"."+a.name] += zipPop[a.zipcode]
	}
	return names, nil
}

//fills known dead space with "No Data" to make map look nicer, not the best fix
func fillDeadSpace(mapUS [50][116][]zip) ([50][116][]zip, error) {
	for x := 5; x < 51; x++ {
		for y := 1; y < 25; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "No Data"}}
			}
		}
	}
	for x := 8; x < 62; x++ {
		for y := 25; y < 30; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "No Data"}}
			}
		}
	}
	for x := 15; x < 43; x++ {
		for y := 30; y < 33; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "No Data"}}
			}
		}
	}
	for x := 40; x < 50; x++ {
		for y := 31; y < 39; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "No Data"}}
			}
		}
	}
	return mapUS, nil
}

//Converts a latitude to fit into the grid
func latConvert(lat float64) int {
	t := 49 - (math.Round(lat/.5) - 49)
	if t == -1 {
		fmt.Println(lat)
	}
	return int(t)
}

//Converts a longitude value to fit into the grid
func longConvert(long float64) int {
	long = math.Abs(long)
	long -= 9
	t := 115 - (math.Floor(long/.5) - 116)
	return int(t)
}
