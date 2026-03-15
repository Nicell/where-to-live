package parse

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"sort"
	"strconv"

	"github.com/cheggaaa/pb/v3"
)

// Node A spot on the final map that is exported to a json file
type Node struct {
	zipcodes    []zip
	ShortZip    []int         `json:"z,omitempty"`
	City        string        `json:"c,omitempty"`
	State       string        `json:"s,omitempty"`
	Approximate bool          `json:"a,omitempty"`
	Weather     *SmallWeather `json:"w,omitempty"`
}
type SmallWeather struct {
	Months    *[24]int `json:"m,omitempty"`
	RawScore  int      `json:"r"`
	Score     int      `json:"p"`
	totalDays int
}

// ZipCodes Has a name and all zip codes corresponding to it in an array
type ZipCodes struct {
	CityState string   `json:"c"`
	Zip       []string `json:"z"`
}

const (
	rankLimit        = 10
	rankClusterRange = 1
)

// USMap Returns the top best and worst places as well as all the data in the map
type USMap struct {
	Top    [][2]int      `json:"t"`
	Bottom [][2]int      `json:"b"`
	Map    [50][116]Node `json:"m"`
}

// WriteJSON Takes in all the data and writes it to a json file
func WriteJSON() {
	fmt.Println("Building map assets")
	mapUS, err := BuildMap()
	if err != nil {
		panic(err)
	}
	file, err := json.MarshalIndent(mapUS, "", " ")
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile("web/src/assets/map.json", file, 0644)
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
	err = ioutil.WriteFile("web/src/assets/zip.json", file, 0644)
	if err != nil {
		panic(err)
	}
	err = writeSearchJSON()
	if err != nil {
		panic(err)
	}
}

// BuildMap Takes in the zip code map and the weather map and combines them
func BuildMap() (USMap, error) {
	fullMap := USMap{}
	data, err := buildWeatherMap()
	if err != nil {
		return fullMap, err
	}
	zips, err := makeMap()
	if err != nil {
		return fullMap, err
	}

	totalCells := len(fullMap.Map) * len(fullMap.Map[0])
	fmt.Printf("Combining weather and zip data across %d grid cells\n", totalCells)
	bar := pb.StartNew(totalCells)
	defer bar.Finish()

	for x, b := range fullMap.Map {
		for y := range b {
			if len(zips[x][y]) > 0 {
				fullMap.Map[x][y].City = zips[x][y][0].name
				fullMap.Map[x][y].zipcodes = zips[x][y]
				for _, a := range zips[x][y] {
					if len(a.zipcode) > 0 {
						i, err := strconv.Atoi(a.zipcode)
						if err != nil {
							return fullMap, err
						}
						fullMap.Map[x][y].ShortZip = append(fullMap.Map[x][y].ShortZip, i)
					}
				}
				fullMap.Map[x][y].State = zips[x][y][0].state
				fullMap.Map[x][y].Weather = totalWeathertoSmall(data[x][y].Weather)
			}
			bar.Increment()
		}
	}
	fullMap = fillApproximateLabels(fullMap)
	fullMap.Top, fullMap.Bottom = buildRankings(fullMap, data)
	return normalizeScores(fullMap, data), nil
}

func totalWeathertoSmall(weather TotalWeather) *SmallWeather {
	if len(weather.Months) == 0 {
		return &SmallWeather{}
	}
	Months := [24]int{}
	Months[0] = int(weather.Months["January"].Good)
	Months[1] = int(weather.Months["January"].Bad)
	Months[2] = int(weather.Months["February"].Good)
	Months[3] = int(weather.Months["February"].Bad)
	Months[4] = int(weather.Months["March"].Good)
	Months[5] = int(weather.Months["March"].Bad)
	Months[6] = int(weather.Months["April"].Good)
	Months[7] = int(weather.Months["April"].Bad)
	Months[8] = int(weather.Months["May"].Good)
	Months[9] = int(weather.Months["May"].Bad)
	Months[10] = int(weather.Months["June"].Good)
	Months[11] = int(weather.Months["June"].Bad)
	Months[12] = int(weather.Months["July"].Good)
	Months[13] = int(weather.Months["July"].Bad)
	Months[14] = int(weather.Months["August"].Good)
	Months[15] = int(weather.Months["August"].Bad)
	Months[16] = int(weather.Months["September"].Good)
	Months[17] = int(weather.Months["September"].Bad)
	Months[18] = int(weather.Months["October"].Good)
	Months[19] = int(weather.Months["October"].Bad)
	Months[20] = int(weather.Months["November"].Good)
	Months[21] = int(weather.Months["November"].Bad)
	Months[22] = int(weather.Months["December"].Good)
	Months[23] = int(weather.Months["December"].Bad)
	smallWeather := SmallWeather{Months: &Months, totalDays: weather.totalDays}
	return &smallWeather
}

func hasRealLocation(node Node) bool {
	return len(node.ShortZip) > 0
}

type nodeScore struct {
	x     int
	y     int
	score int
}

func buildRankings(fullMap USMap, data [50][116]Station) ([][2]int, [][2]int) {
	candidates := make([]nodeScore, 0)
	for x, row := range fullMap.Map {
		for y, node := range row {
			if !hasRealLocation(node) || node.City == "" {
				continue
			}
			candidates = append(candidates, nodeScore{x: x, y: y, score: calcGoodBad(x, y, data)})
		}
	}

	return selectRankings(candidates, false), selectRankings(candidates, true)
}

func selectRankings(candidates []nodeScore, ascending bool) [][2]int {
	sorted := append([]nodeScore(nil), candidates...)
	sort.Slice(sorted, func(i, j int) bool {
		if sorted[i].score != sorted[j].score {
			if ascending {
				return sorted[i].score < sorted[j].score
			}
			return sorted[i].score > sorted[j].score
		}
		if sorted[i].x != sorted[j].x {
			return sorted[i].x < sorted[j].x
		}
		return sorted[i].y < sorted[j].y
	})

	selected := make([]nodeScore, 0, rankLimit)
	rankings := make([][2]int, 0, rankLimit)
	for _, candidate := range sorted {
		if overlapsRankArea(candidate, selected) {
			continue
		}
		selected = append(selected, candidate)
		rankings = append(rankings, [2]int{candidate.y, candidate.x})
		if len(rankings) == rankLimit {
			break
		}
	}

	return rankings
}

func overlapsRankArea(candidate nodeScore, selected []nodeScore) bool {
	for _, existing := range selected {
		if absInt(existing.x-candidate.x) <= rankClusterRange && absInt(existing.y-candidate.y) <= rankClusterRange {
			return true
		}
	}
	return false
}

func normalizeScores(fullMap USMap, data [50][116]Station) USMap {
	scores := make([]nodeScore, 0)
	minScore := 0
	maxScore := 0
	initialized := false
	for x, row := range fullMap.Map {
		for y, node := range row {
			if node.City == "" || node.Weather == nil {
				continue
			}
			score := calcGoodBad(x, y, data)
			scores = append(scores, nodeScore{x: x, y: y, score: score})
			if !initialized {
				minScore = score
				maxScore = score
				initialized = true
				continue
			}
			if score < minScore {
				minScore = score
			}
			if score > maxScore {
				maxScore = score
			}
		}
	}

	if len(scores) == 0 {
		return fullMap
	}

	if minScore == maxScore {
		for _, entry := range scores {
			fullMap.Map[entry.x][entry.y].Weather.RawScore = entry.score
			fullMap.Map[entry.x][entry.y].Weather.Score = 50
		}
		return fullMap
	}

	rangeSize := float64(maxScore - minScore)
	for _, entry := range scores {
		normalized := int(math.Round(float64(entry.score-minScore) / rangeSize * 100))
		fullMap.Map[entry.x][entry.y].Weather.RawScore = entry.score
		fullMap.Map[entry.x][entry.y].Weather.Score = normalized
	}

	return fullMap
}

func fillApproximateLabels(fullMap USMap) USMap {
	for x, row := range fullMap.Map {
		for y, node := range row {
			if hasRealLocation(node) || node.Weather == nil || (node.City != "" && node.City != "Unknown") {
				continue
			}
			city, state, ok := nearestRealLocation(fullMap, x, y)
			if !ok {
				continue
			}
			fullMap.Map[x][y].City = city
			fullMap.Map[x][y].State = state
			fullMap.Map[x][y].Approximate = true
		}
	}
	return fullMap
}

func nearestRealLocation(fullMap USMap, x, y int) (string, string, bool) {
	maxRadius := len(fullMap.Map)
	if len(fullMap.Map[0]) > maxRadius {
		maxRadius = len(fullMap.Map[0])
	}

	for radius := 1; radius <= maxRadius; radius++ {
		bestDistance := maxRadius*maxRadius + len(fullMap.Map[0])*len(fullMap.Map[0])
		bestCity := ""
		bestState := ""

		for a := x - radius; a <= x+radius; a++ {
			for b := y - radius; b <= y+radius; b++ {
				if a < 0 || b < 0 || a >= len(fullMap.Map) || b >= len(fullMap.Map[a]) {
					continue
				}
				if absInt(a-x) != radius && absInt(b-y) != radius {
					continue
				}
				node := fullMap.Map[a][b]
				if !hasRealLocation(node) || node.City == "" || node.City == "Unknown" {
					continue
				}

				distance := (a-x)*(a-x) + (b-y)*(b-y)
				if distance < bestDistance {
					bestDistance = distance
					bestCity = node.City
					bestState = node.State
				}
			}
		}

		if bestCity != "" {
			return bestCity, bestState, true
		}
	}

	return "", "", false
}

func absInt(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

// Calculates how pleasant somewhere is by taking good - bad days of all months and adding them together
func calcGoodBad(lat, long int, weather [50][116]Station) int {
	score := 0
	for _, c := range weather[lat][long].Weather.Months {
		score += int(c.Good)
		score -= int(c.Bad)
	}
	return score
}

// Builds a 2D array of all zips in the mapUS
func buildSearchZip(mapUS USMap) ([99999]string, error) {
	mapZip := [99999]string{}
	for _, a := range mapUS.Map {
		for _, b := range a {
			if len(b.zipcodes) != 0 {
				for _, c := range b.zipcodes {
					if c.name != "Unknown" && c.zipcode != "" {
						zip, err := strconv.Atoi(c.zipcode)
						if err != nil {
							return mapZip, err
						}
						mapZip[zip] = c.name + ", " + c.state
					}
				}
			}
		}
	}
	return mapZip, nil
}
