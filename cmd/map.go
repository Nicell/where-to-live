package cmd

import (
	"encoding/csv"
	"fmt"
	"math"
	"os"
	"strconv"
)

//a struct that stores the zipcode, lat, long, and name of a location
type zip struct {
	zipcode string
	lat     string
	long    string
	name    string
}

type population struct {
	population string
	zipcode    string
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
	for _, i := range lines {
		data := zip{
			zipcode: i[0],
			lat:     i[1],
			long:    i[2],
			name:    i[4],
		}
		long, _ := strconv.ParseFloat(data.long, 64)
		lat, _ := strconv.ParseFloat(data.lat, 64)
		if long < -125.0 || long > -67 || lat > 50 || lat < 24 {

		} else {
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
	reader.Read() //ignores column header
	lines, err := reader.ReadAll()
	if err != nil {
		return pop, err
	}
	for _, i := range lines {
		data := population{
			zipcode:    i[0],
			population: i[1],
		}
		k, err := strconv.ParseInt(data.population, 10, 32)
		if err != nil {
			return pop, err
		}
		pop[data.zipcode] = int(k)
	}
	return pop, nil
}

//Maps all zip codes to a grid stacking overlapping counties
func MakeMap() ([50][116]string, error) {
	mapUS := [50][116]string{}
	zips, err := parseZip()
	if err != nil {
		return mapUS, err
	}
	pop, err := parsePopulation()
	if err != nil {
		fmt.Print(err)
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
		if mapUS[latConvert(j)][longConvert(k)] != "" {
			if pop[mapUS[latConvert(j)][longConvert(k)]] < pop[i.zipcode] {
				mapUS[latConvert(j)][longConvert(k)] = i.zipcode
			}
		} else {
			mapUS[latConvert(j)][longConvert(k)] = i.zipcode
		}
	}
	return mapUS, nil
}

//Converts a latitude to fit into the grid
func latConvert(lat float64) int {
	t := ((math.Round(lat/.5) * .5) * 2) - 49
	return int(t)
}

//Converts a longitude value to fit into the grid
func longConvert(long float64) int {
	long = math.Abs(long)
	long -= 9
	t := ((math.Round(long/.5) * .5) * 2) - 116
	return int(t)
}
