package cmd

type node struct {
	zipcodes []string
	city     string
	state    string
	weather  totalWeather
}

func BuildMap() [50][116][]node {
	fullMap := [50][116][]node{}
	//	zips, err := makeMap()
	//	if err != nil {
	//		panic(err)
	//	}

	return fullMap
}
