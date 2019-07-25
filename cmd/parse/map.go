package parse

import (
	"encoding/json"
	"io/ioutil"
)

//Node A spot on the final map that is exported to a json file
type Node struct {
	Zipcodes []Zip        `json:"z"`
	City     string       `json:"c"`
	State    string       `json:"s"`
	Weather  TotalWeather `json:"w"`
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
	file, err = json.MarshalIndent(buildSearchZip(mapUS), "", " ")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("zip.json", file, 0644)
	if err != nil {
		panic(err)
	}
}

//BuildMap Takes in the zip code map and the weather map and combines them
func BuildMap() ([52][116]Node, error) {
	fullMap := [52][116]Node{}
	data, err := BuildWeatherMap()
	if err != nil {
		return fullMap, err
	}
	zips, err := makeMap()
	if err != nil {
		return fullMap, err
	}
	for x, b := range fullMap {
		for y := range b {
			if len(zips[x][y]) > 0 {
				fullMap[x][y].City = zips[x][y][0].Name
				fullMap[x][y].Zipcodes = zips[x][y]
				fullMap[x][y].State = zips[x][y][0].State
				fullMap[x][y].Weather = data[x][y].Weather
			}
		}
	}
	return fullMap, nil
}

func buildSearchZip(mapUS [52][116]Node) [][][]string {
	zipArray := [][][]string{}
	tmp2 := [][]string{}
	tmp := []string{}
	for _, a := range mapUS {
		for _, b := range a {
			if len(b.Zipcodes) != 0 {
				for _, c := range b.Zipcodes {
					tmp = append(tmp, c.Zipcode+", "+c.Name+", "+c.State)
					tmp2 = append(tmp2, tmp)
					tmp = []string{}
				}
				zipArray = append(zipArray, tmp2)
				tmp2 = [][]string{}
			}
		}
	}
	return zipArray
}
