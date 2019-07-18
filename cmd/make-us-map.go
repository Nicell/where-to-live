package cmd

import (
	"encoding/csv"
	"os"
)

//a struct that stores the zipcode, lat, long, and name of a location
type Zip struct {
	zipcode string
	lat     string
	long    string
	name    string
}

//parses the zips.tsv file
func ParseZip() []Zip {
	file, err := os.Open("data/zips.tsv")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = '\t' //CSV reader uses tabs instead of commas
	lines, err := reader.ReadAll()
	if err != nil {
		panic(err)
	}
	zips := []Zip{}
	for _, lines := range lines {
		data := Zip{
			zipcode: lines[0],
			lat:     lines[1],
			long:    lines[2],
			name:    lines[4],
		}
		zips = append(zips, data)
	}
	return zips
}
