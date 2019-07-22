package cmd

import "github.com/Nicell/where-to-live/cmd/parse"

type node struct {
	zipcodes []string
	city     string
	state    string
	weather  parse.TotalWeather
}

func BuildMap() [50][116][]node {
	fullMap := [50][116][]node{}
	//zips, err := makeMap()
	//	if err != nil {
	//		panic(err)
	//	}

	return fullMap
}
