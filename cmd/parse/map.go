package parse

import (
	"encoding/json"
	"io/ioutil"
	"strconv"
)

//Node A spot on the final map that is exported to a json file
type Node struct {
	Zipcodes []Zip        `json:"z"`
	City     string       `json:"c"`
	State    string       `json:"s"`
	Weather  TotalWeather `json:"w"`
}

//ZipCodes Has a name and all zip codes corresponding to it in an array
type ZipCodes struct {
	CityState string   `json:"c"`
	Zip       []string `json:"z"`
}

//USMap Returns the top five best and worst places as well as all the data in the map
type USMap struct {
	Top    [][]int       `json:"t"`
	Bottom [][]int       `json:"b"`
	Map    [50][116]Node `json:"m"`
}

//WriteJSON Takes in all the data and writes it to a json file
func WriteJSON() {
	mapUS, err := BuildMap()
	if err != nil {
		panic(err)
	}
	file, err := json.MarshalIndent(mapUS, "", " ")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("map.json", file, 0644)
	if err != nil {
		panic(err)
	}
	data, err := buildSearchZip(mapUS)
	if err != nil {
		panic(err)
	}
	file, err = json.MarshalIndent(data, "", " ")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("zip.json", file, 0644)
	if err != nil {
		panic(err)
	}
}

//BuildMap Takes in the zip code map and the weather map and combines them
func BuildMap() (USMap, error) {
	fullMap := USMap{}
	data, err := BuildWeatherMap()
	if err != nil {
		return fullMap, err
	}
	zips, err := makeMap()
	if err != nil {
		return fullMap, err
	}
	for x, b := range fullMap.Map {
		for y := range b {
			if len(zips[x][y]) > 0 {
				fullMap.Map[x][y].City = zips[x][y][0].Name
				fullMap.Map[x][y].Zipcodes = zips[x][y]
				fullMap.Map[x][y].State = zips[x][y][0].State
				fullMap.Map[x][y].Weather = data[x][y].Weather
			}
		}
	}
	return fullMap, nil
}

//Builds a 2D array of all zips in the mapUS
func buildSearchZip(mapUS USMap) ([99999]string, error) {
	mapZip := [99999]string{}
	for _, a := range mapUS.Map {
		for _, b := range a {
			if len(b.Zipcodes) != 0 {
				for _, c := range b.Zipcodes {
					if c.Name != "No Data" {
						zip, err := strconv.Atoi(c.Zipcode)
						if err != nil {
							return mapZip, err
						}
						mapZip[zip] = c.Name + ", " + c.State
					}
				}
			}
		}
	}
	return mapZip, nil
}
