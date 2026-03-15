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
