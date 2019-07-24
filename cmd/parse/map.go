package parse

import (
	"encoding/json"
	"io/ioutil"
)

type Node struct {
	Zipcodes []Zip        `json:"z"`
	City     string       `json:"c"`
	State    string       `json:"s"`
	Weather  TotalWeather `json:"w"`
}

func WriteJSON() {
	mapUS, err := BuildMap()
	if err != nil {
		panic(err)
	}
	file, err := json.MarshalIndent(mapUS, "", " ")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("test.json", file, 0644)
	if err != nil {
		panic(err)
	}
}

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
