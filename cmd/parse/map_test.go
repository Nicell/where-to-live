package parse

import "testing"

func TestNormalizeScores(t *testing.T) {
	fullMap := USMap{}
	data := [50][116]Station{}

	fullMap.Map[0][0] = Node{City: "LOW", Weather: &SmallWeather{}}
	fullMap.Map[0][1] = Node{City: "MID A", Weather: &SmallWeather{}}
	fullMap.Map[0][2] = Node{City: "MID B", Weather: &SmallWeather{}}
	fullMap.Map[0][3] = Node{City: "HIGH", Weather: &SmallWeather{}}

	data[0][0].Weather.Months = map[string]MonthWeather{"January": {Bad: 10}}
	data[0][1].Weather.Months = map[string]MonthWeather{"January": {}}
	data[0][2].Weather.Months = map[string]MonthWeather{"January": {}}
	data[0][3].Weather.Months = map[string]MonthWeather{"January": {Good: 30}}

	fullMap = normalizeScores(fullMap, data)

	tests := []struct {
		label     string
		weather   *SmallWeather
		wantRaw   int
		wantScore int
	}{
		{label: "low", weather: fullMap.Map[0][0].Weather, wantRaw: -10, wantScore: 0},
		{label: "mid a", weather: fullMap.Map[0][1].Weather, wantRaw: 0, wantScore: 25},
		{label: "mid b", weather: fullMap.Map[0][2].Weather, wantRaw: 0, wantScore: 25},
		{label: "high", weather: fullMap.Map[0][3].Weather, wantRaw: 30, wantScore: 100},
	}

	for _, tt := range tests {
		if tt.weather.RawScore != tt.wantRaw {
			t.Fatalf("%s RawScore = %d, want %d", tt.label, tt.weather.RawScore, tt.wantRaw)
		}
		if tt.weather.Score != tt.wantScore {
			t.Fatalf("%s Score = %d, want %d", tt.label, tt.weather.Score, tt.wantScore)
		}
	}
}

func TestNormalizeScoresSingleLocation(t *testing.T) {
	fullMap := USMap{}
	data := [50][116]Station{}

	fullMap.Map[10][10] = Node{City: "ONLY", Weather: &SmallWeather{}}
	data[10][10].Weather.Months = map[string]MonthWeather{"January": {Good: 12, Bad: 3}}

	fullMap = normalizeScores(fullMap, data)

	if fullMap.Map[10][10].Weather.RawScore != 9 {
		t.Fatalf("RawScore = %d, want 9", fullMap.Map[10][10].Weather.RawScore)
	}
	if fullMap.Map[10][10].Weather.Score != 50 {
		t.Fatalf("Score = %d, want 50", fullMap.Map[10][10].Weather.Score)
	}
}

func TestFillApproximateLabels(t *testing.T) {
	fullMap := USMap{}

	fullMap.Map[0][0] = Node{City: "SEATTLE", State: "WA", ShortZip: []int{98101}, Weather: &SmallWeather{}}
	fullMap.Map[0][2] = Node{City: "SPOKANE", State: "WA", ShortZip: []int{99201}, Weather: &SmallWeather{}}
	fullMap.Map[0][1] = Node{City: "Unknown", Weather: &SmallWeather{}}

	fullMap = fillApproximateLabels(fullMap)

	if fullMap.Map[0][1].City != "SEATTLE" {
		t.Fatalf("City = %q, want %q", fullMap.Map[0][1].City, "SEATTLE")
	}
	if fullMap.Map[0][1].State != "WA" {
		t.Fatalf("State = %q, want %q", fullMap.Map[0][1].State, "WA")
	}
	if !fullMap.Map[0][1].Approximate {
		t.Fatal("Approximate = false, want true")
	}
}

func TestBuildRankingsKeepsTenDistinctAreas(t *testing.T) {
	fullMap := USMap{}
	data := [50][116]Station{}

	addLocation := func(x, y, score int, city string) {
		fullMap.Map[x][y] = Node{
			City:     city,
			State:    "CA",
			ShortZip: []int{90000 + x*100 + y},
			Weather:  &SmallWeather{},
		}
		data[x][y].Weather.Months = make(map[string]MonthWeather)
		if score >= 0 {
			data[x][y].Weather.Months["January"] = MonthWeather{Good: float64(score)}
			return
		}
		data[x][y].Weather.Months["January"] = MonthWeather{Bad: float64(-score)}
	}

	topCandidates := []struct {
		x, y  int
		score int
		city  string
	}{
		{0, 0, 100, "LOS ANGELES"},
		{0, 1, 99, "SANTA MONICA"},
		{0, 3, 98, "SAN DIEGO"},
		{0, 6, 97, "VENTURA"},
		{0, 9, 96, "SAN JOSE"},
		{3, 0, 95, "SACRAMENTO"},
		{3, 3, 94, "SANTA BARBARA"},
		{3, 6, 93, "FRESNO"},
		{3, 9, 92, "PALM SPRINGS"},
		{6, 0, 91, "SAN LUIS OBISPO"},
		{6, 3, 90, "MONTEREY"},
		{6, 6, 89, "EUREKA"},
	}
	for _, candidate := range topCandidates {
		addLocation(candidate.x, candidate.y, candidate.score, candidate.city)
	}

	bottomCandidates := []struct {
		x, y  int
		score int
		city  string
	}{
		{40, 100, -300, "COLEBROOK"},
		{40, 101, -299, "ISLAND POND"},
		{40, 103, -298, "EUSTIS"},
		{40, 106, -297, "NEWPORT"},
		{40, 109, -296, "IRON RIVER"},
		{43, 100, -295, "CRANE LAKE"},
		{43, 103, -294, "COOK"},
		{43, 106, -293, "SARANAC LAKE"},
		{43, 109, -292, "WEST CHAZY"},
		{46, 100, -291, "PERU"},
		{46, 103, -290, "EAGLE RIVER"},
		{46, 106, -289, "PHILLIPS"},
	}
	for _, candidate := range bottomCandidates {
		addLocation(candidate.x, candidate.y, candidate.score, candidate.city)
	}

	top, bottom := buildRankings(fullMap, data)

	if len(top) != 10 {
		t.Fatalf("len(top) = %d, want 10", len(top))
	}
	if len(bottom) != 10 {
		t.Fatalf("len(bottom) = %d, want 10", len(bottom))
	}

	if containsRank(top, 1, 0) {
		t.Fatal("top rankings include adjacent duplicate square at [1,0]")
	}
	if !containsRank(top, 0, 0) {
		t.Fatal("top rankings missing strongest square at [0,0]")
	}

	if containsRank(bottom, 101, 40) {
		t.Fatal("bottom rankings include adjacent duplicate square at [101,40]")
	}
	if !containsRank(bottom, 100, 40) {
		t.Fatal("bottom rankings missing lowest square at [100,40]")
	}
}

func containsRank(ranks [][2]int, y, x int) bool {
	for _, rank := range ranks {
		if rank == [2]int{y, x} {
			return true
		}
	}
	return false
}
