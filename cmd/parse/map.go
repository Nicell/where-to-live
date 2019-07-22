package parse

import (
	"encoding/json"
	"fmt"
	"os"
)

type Node struct {
	Zipcodes []Zip
	City     string
	State    string
	Weather  TotalWeather
}

func WriteJSON() {
	mapUS := BuildMap()
	file, err := json.MarshalIndent(mapUS, "", " ")
	if err != nil {
		panic(err)
	}
	fmt.Println(file)
	jsonFile, err := os.Create("test.json")
	_, err = jsonFile.Write(file)
	if err != nil {
		panic(err)
	}
	defer jsonFile.Close()
}

func BuildMap() [50][116]Node {
	fullMap := [50][116]Node{}
	reverse, err := reverseMap()
	if err != nil {
		panic(err)
	}
	data, err := parseGSOD(2018)
	if err != nil {
		panic(err)
	}
	zips, err := makeMap()
	if err != nil {
		panic(err)
	}
	for x, b := range fullMap {
		for y := range b {
			if len(zips[x][y]) > 0 {
				fullMap[x][y].City = zips[x][y][0].Name
				fullMap[x][y].Zipcodes = zips[x][y]
				fullMap[x][y].State = zips[x][y][0].State
				fullMap[x][y].Weather = data[reverse[Location{x, y, TotalWeather{}}]].Weather
			}
		}
	}
	return fullMap
}

func reverseMap() (map[Location]string, error) {
	reverse := make(map[Location]string)
	regular, err := parseISDHistory()
	if err != nil {
		return reverse, err
	}
	for x, v := range regular {
		reverse[v] = x
	}
	return reverse, nil
}
