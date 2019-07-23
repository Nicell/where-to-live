package parse

import (
	"encoding/json"
	"os"
)

type Node struct {
	Zipcodes []Zip
	City     string
	State    string
	Weather  TotalWeather
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
	jsonFile, err := os.Create("test.json")
	_, err = jsonFile.Write(file)
	if err != nil {
		panic(err)
	}
	defer jsonFile.Close()
}

func BuildMap() ([52][116]Node, error) {
	fullMap := [52][116]Node{}
	t, err := ParseGSOD(2018)
	data := AverageStations(t)
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
