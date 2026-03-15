package parse

import (
	"encoding/csv"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"sync"
)

var (
	stateOnce sync.Once
	stateData map[string]string
	stateErr  error

	zipOnce sync.Once
	zipData []zip
	zipErr  error

	populationOnce sync.Once
	populationData map[string]int
	populationErr  error

	mapOnce sync.Once
	mapData [50][116][]zip
	mapErr  error
)

// zip a struct that stores the zipcode, lat, long, and name of a Station
type zip struct {
	zipcode string
	lat     string
	long    string
	name    string
	state   string
}

// Parses the states.csv and builds a map with number (as a string) keys and abbreviations (WI, CA, CO, etc.) as value
func parseState() (map[string]string, error) {
	stateOnce.Do(func() {
		states := make(map[string]string)
		file, err := os.Open("data/states.csv")
		if err != nil {
			stateErr = err
			return
		}
		defer file.Close()
		lines, err := csv.NewReader(file).ReadAll()
		if err != nil {
			stateErr = err
			return
		}
		for _, i := range lines {
			states[i[2]] = i[1]
		}
		stateData = states
	})
	return stateData, stateErr
}

// parses the zips.tsv file
func parseZip() ([]zip, error) {
	zipOnce.Do(func() {
		file, err := os.Open("data/zips.tsv")
		if err != nil {
			zipErr = err
			return
		}
		defer file.Close()

		reader := csv.NewReader(file)
		reader.Comma = '\t' //CSV reader uses tabs instead of commas
		lines, err := reader.ReadAll()
		if err != nil {
			zipErr = err
			return
		}

		states, err := parseState()
		if err != nil {
			zipErr = err
			return
		}

		zips := make([]zip, 0, len(lines))
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
		zipData = zips
	})
	return zipData, zipErr
}

// Parses population-by-zip.csv to put into a map with keys of zip codes
func parsePopulation() (map[string]int, error) {
	populationOnce.Do(func() {
		pop := make(map[string]int)
		file, err := os.Open("data/population-by-zip.csv")
		if err != nil {
			populationErr = err
			return
		}
		defer file.Close()

		reader := csv.NewReader(file)
		_, err = reader.Read() //ignores column header
		if err != nil {
			populationErr = err
			return
		}
		lines, err := reader.ReadAll()
		if err != nil {
			populationErr = err
			return
		}
		for _, i := range lines {
			k, err := strconv.ParseInt(i[1], 10, 32)
			if err != nil {
				populationErr = err
				return
			}
			pop[i[0]] = int(k)
		}
		populationData = pop
	})
	return populationData, populationErr
}

// Maps all zip codes to a grid stacking overlapping counties
func makeMap() ([50][116][]zip, error) {
	mapOnce.Do(func() {
		mapUS := [50][116][]zip{}
		zips, err := parseZip()
		if err != nil {
			mapErr = err
			return
		}
		namePop, err := nameToPop()
		if err != nil {
			mapErr = err
			return
		}
		for _, i := range zips {
			j, err := strconv.ParseFloat(i.lat, 64)
			if err != nil {
				mapErr = err
				return
			}
			k, err := strconv.ParseFloat(i.long, 64)
			if err != nil {
				mapErr = err
				return
			}
			latIdx := latConvert(j)
			longIdx := longConvert(k)
			if len(mapUS[latIdx][longIdx]) != 0 {
				if namePop[mapUS[latIdx][longIdx][0].state+"."+mapUS[latIdx][longIdx][0].name] < namePop[i.state+"."+i.name] {
					mapUS[latIdx][longIdx] = append([]zip{i}, mapUS[latIdx][longIdx]...)
				} else {
					mapUS[latIdx][longIdx] = append(mapUS[latIdx][longIdx], i)
				}
			} else {
				mapUS[latIdx][longIdx] = append(mapUS[latIdx][longIdx], i)
			}
		}
		mapData, mapErr = fillDeadSpace(mapUS)
	})
	return mapData, mapErr
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

// fills known dead space with "Unknown" to make map look nicer
func fillDeadSpace(mapUS [50][116][]zip) ([50][116][]zip, error) {
	mapUS = fillKnownDeadSpace(mapUS)
	mapUS = fillEnclosedDeadSpace(mapUS)
	return mapUS, nil
}

// fillKnownDeadSpace preserves the original hand-tuned regions used to smooth
// large empty areas in the coarse grid.
func fillKnownDeadSpace(mapUS [50][116][]zip) [50][116][]zip {
	for x := 5; x < 51; x++ {
		for y := 1; y < 25; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "Unknown"}}
			}
		}
	}
	for x := 8; x < 62; x++ {
		for y := 25; y < 30; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "Unknown"}}
			}
		}
	}
	for x := 15; x < 43; x++ {
		for y := 30; y < 33; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "Unknown"}}
			}
		}
	}
	for x := 40; x < 50; x++ {
		for y := 31; y < 39; y++ {
			if len(mapUS[y][x]) == 0 {
				mapUS[y][x] = []zip{{name: "Unknown"}}
			}
		}
	}
	return mapUS
}

// fillEnclosedDeadSpace patches isolated single-cell gaps when all four
// orthogonal neighbors already exist. This avoids obvious holes without
// spreading into coastlines or large empty regions.
func fillEnclosedDeadSpace(mapUS [50][116][]zip) [50][116][]zip {
	occupied := [50][116]bool{}
	for y := range mapUS {
		for x := range mapUS[y] {
			occupied[y][x] = len(mapUS[y][x]) > 0
		}
	}

	for y := 1; y < len(mapUS)-1; y++ {
		for x := 1; x < len(mapUS[y])-1; x++ {
			if occupied[y][x] {
				continue
			}
			if occupied[y-1][x] && occupied[y+1][x] && occupied[y][x-1] && occupied[y][x+1] {
				mapUS[y][x] = []zip{{name: "Unknown"}}
			}
		}
	}

	return mapUS
}

// Converts a latitude to fit into the grid
func latConvert(lat float64) int {
	t := 49 - (math.Round(lat/.5) - 49)
	if t == -1 {
		fmt.Println(lat)
	}
	return int(t)
}

// Converts a longitude value to fit into the grid
func longConvert(long float64) int {
	long = math.Abs(long)
	long -= 9
	t := 115 - (math.Floor(long/.5) - 116)
	return int(t)
}
