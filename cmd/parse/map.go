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
	Top    [5][2]int `json:"t"`
	valTop [5]int
	Bottom [5][2]int `json:"b"`
	valBot [5]int
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
	fullMap.valTop = [5]int{-400, -400, -400, -400, -400}
	data, err := buildWeatherMap()
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
				if fullMap.Map[x][y].City != "No Data" && fullMap.Map[x][y].City != "" {
					calc := calcGoodBad(x, y, data)
					if calc > fullMap.valTop[4] {
						for c := 0; c < 5; c++ {
							if calc > fullMap.valTop[c] {
								storedArr := fullMap.valTop
								latLongArr := fullMap.Top
								latLongArr[c] = [2]int{y, x}
								storedArr[c] = calc
								for d := c + 1; d < 5; d++ {
									storedArr[d] = fullMap.valTop[d-1]
									latLongArr[d] = fullMap.Top[d-1]
									c = 6
								}
								fullMap.valTop = storedArr
								fullMap.Top = latLongArr
							}
						}
					} else if calc < fullMap.valBot[4] {
						for c := 0; c < 5; c++ {
							if calc < fullMap.valBot[c] {
								storedArr := fullMap.valBot
								latLongArr := fullMap.Bottom
								latLongArr[c] = [2]int{y, x}
								storedArr[c] = calc
								for d := c + 1; d < 5; d++ {
									storedArr[d] = fullMap.valBot[d-1]
									latLongArr[d] = fullMap.Bottom[d-1]
									c = 6
								}
								fullMap.valBot = storedArr
								fullMap.Bottom = latLongArr
							}
						}
					}
				}
			}
		}
	}
	return fullMap, nil
}

//Calculates how pleasant somewhere is by taking good - bad days of all months and adding them together
func calcGoodBad(lat, long int, weather [50][116]Station) int {
	score := 0
	for _, c := range weather[lat][long].Weather.Months {
		score += int(c.Good)
		score -= int(c.Bad)
	}
	return score
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
