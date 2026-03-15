package parse

import (
	"encoding/json"
	"io/ioutil"
)

type SearchLocation struct {
	Zip            string `json:"z"`
	Name           string `json:"n"`
	ZipPopulation  int    `json:"p"`
	CityPopulation int    `json:"c"`
}

func writeSearchJSON() error {
	data, err := buildSearchIndex()
	if err != nil {
		return err
	}

	file, err := json.MarshalIndent(data, "", " ")
	if err != nil {
		return err
	}

	return ioutil.WriteFile("web/src/assets/search.json", file, 0644)
}

func buildSearchIndex() ([]SearchLocation, error) {
	zips, err := parseZip()
	if err != nil {
		return nil, err
	}

	zipPopulation, err := parsePopulation()
	if err != nil {
		return nil, err
	}

	cityPopulation, err := nameToPop()
	if err != nil {
		return nil, err
	}

	locations := make([]SearchLocation, 0, len(zips))
	for _, entry := range zips {
		if entry.zipcode == "" || entry.name == "" || entry.name == "Unknown" {
			continue
		}

		locations = append(locations, SearchLocation{
			Zip:            entry.zipcode,
			Name:           entry.name + ", " + entry.state,
			ZipPopulation:  zipPopulation[entry.zipcode],
			CityPopulation: cityPopulation[entry.state+"."+entry.name],
		})
	}

	return locations, nil
}
