package parse

import (
	"encoding/csv"
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
	mapData [mapRows][mapCols][]zip
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
func makeMap() ([mapRows][mapCols][]zip, error) {
	mapOnce.Do(func() {
		mapUS := [mapRows][mapCols][]zip{}
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
			latIdx, longIdx := gridCellFromLatLong(j, k)
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
func fillDeadSpace(mapUS [mapRows][mapCols][]zip) ([mapRows][mapCols][]zip, error) {
	mapUS = fillEnclosedDeadSpace(mapUS)
	return mapUS, nil
}

type gridPoint struct {
	row int
	col int
}

// fillEnclosedDeadSpace fills empty regions that are completely surrounded by
// occupied cells. Regions connected to the outer edge are preserved so coastlines
// and open water remain untouched.
func fillEnclosedDeadSpace(mapUS [mapRows][mapCols][]zip) [mapRows][mapCols][]zip {
	occupied := [mapRows][mapCols]bool{}
	visited := [mapRows][mapCols]bool{}
	for y := range mapUS {
		for x := range mapUS[y] {
			occupied[y][x] = len(mapUS[y][x]) > 0
		}
	}

	directions := []gridPoint{{row: -1, col: 0}, {row: 1, col: 0}, {row: 0, col: -1}, {row: 0, col: 1}}

	for y := range mapUS {
		for x := range mapUS[y] {
			if occupied[y][x] || visited[y][x] {
				continue
			}

			queue := []gridPoint{{row: y, col: x}}
			region := []gridPoint{}
			visited[y][x] = true
			touchesEdge := false

			for len(queue) > 0 {
				current := queue[0]
				queue = queue[1:]
				region = append(region, current)

				if current.row == 0 || current.row == mapRows-1 || current.col == 0 || current.col == mapCols-1 {
					touchesEdge = true
				}

				for _, direction := range directions {
					nextRow := current.row + direction.row
					nextCol := current.col + direction.col
					if nextRow < 0 || nextRow >= mapRows || nextCol < 0 || nextCol >= mapCols {
						continue
					}
					if occupied[nextRow][nextCol] || visited[nextRow][nextCol] {
						continue
					}
					visited[nextRow][nextCol] = true
					queue = append(queue, gridPoint{row: nextRow, col: nextCol})
				}
			}

			if touchesEdge {
				continue
			}

			for _, point := range region {
				mapUS[point.row][point.col] = []zip{{name: "Unknown"}}
			}
		}
	}

	return mapUS
}
