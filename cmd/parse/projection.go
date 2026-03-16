package parse

import (
	"encoding/csv"
	"math"
	"os"
	"strconv"
	"strings"
	"sync"
)

const (
	mapRows = 50
	mapCols = 96

	lower48LatMin  = 24.0
	lower48LatMax  = 49.0
	lower48LongMin = -125.0
	lower48LongMax = -67.0

	// Standard lower-48 Albers Equal Area Conic parameters.
	albersStdParallel1 = 29.5
	albersStdParallel2 = 45.5
	albersLatOrigin    = 23.0
	albersLongOrigin   = -96.0
)

var (
	projectionN    = 0.5 * (math.Sin(degToRad(albersStdParallel1)) + math.Sin(degToRad(albersStdParallel2)))
	projectionC    = math.Pow(math.Cos(degToRad(albersStdParallel1)), 2) + 2*projectionN*math.Sin(degToRad(albersStdParallel1))
	projectionRho0 = calcRho(degToRad(albersLatOrigin))

	projectionBoundsOnce sync.Once
	projectedMinX        float64
	projectedMaxX        float64
	projectedMinY        float64
	projectedMaxY        float64
)

func degToRad(degrees float64) float64 {
	return degrees * math.Pi / 180
}

func calcRho(lat float64) float64 {
	return math.Sqrt(projectionC-2*projectionN*math.Sin(lat)) / projectionN
}

func projectAlbers(lat, long float64) (float64, float64) {
	latRad := degToRad(lat)
	longRad := degToRad(long)
	longOriginRad := degToRad(albersLongOrigin)

	rho := calcRho(latRad)
	theta := projectionN * (longRad - longOriginRad)

	x := rho * math.Sin(theta)
	y := projectionRho0 - rho*math.Cos(theta)
	return x, y
}

func calculateProjectionBoundsFallback() (float64, float64, float64, float64) {
	minX := math.MaxFloat64
	maxX := -math.MaxFloat64
	minY := math.MaxFloat64
	maxY := -math.MaxFloat64

	for row := 0; row <= 256; row++ {
		lat := lower48LatMin + (lower48LatMax-lower48LatMin)*float64(row)/256
		for col := 0; col <= 256; col++ {
			long := lower48LongMin + (lower48LongMax-lower48LongMin)*float64(col)/256
			x, y := projectAlbers(lat, long)
			if x < minX {
				minX = x
			}
			if x > maxX {
				maxX = x
			}
			if y < minY {
				minY = y
			}
			if y > maxY {
				maxY = y
			}
		}
	}

	return minX, maxX, minY, maxY
}

func loadProjectionBounds() {
	minX := math.MaxFloat64
	maxX := -math.MaxFloat64
	minY := math.MaxFloat64
	maxY := -math.MaxFloat64

	file, err := os.Open("data/zips.tsv")
	if err != nil {
		projectedMinX, projectedMaxX, projectedMinY, projectedMaxY = calculateProjectionBoundsFallback()
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = '\t'
	lines, err := reader.ReadAll()
	if err != nil {
		projectedMinX, projectedMaxX, projectedMinY, projectedMaxY = calculateProjectionBoundsFallback()
		return
	}

	for _, line := range lines {
		if len(line) < 3 {
			continue
		}
		lat, err := strconv.ParseFloat(strings.TrimSpace(line[1]), 64)
		if err != nil || lat < lower48LatMin || lat > lower48LatMax {
			continue
		}
		long, err := strconv.ParseFloat(strings.TrimSpace(line[2]), 64)
		if err != nil || long < lower48LongMin || long > lower48LongMax {
			continue
		}
		x, y := projectAlbers(lat, long)
		if x < minX {
			minX = x
		}
		if x > maxX {
			maxX = x
		}
		if y < minY {
			minY = y
		}
		if y > maxY {
			maxY = y
		}
	}

	if minX == math.MaxFloat64 || minY == math.MaxFloat64 {
		projectedMinX, projectedMaxX, projectedMinY, projectedMaxY = calculateProjectionBoundsFallback()
		return
	}

	projectedMinX = minX
	projectedMaxX = maxX
	projectedMinY = minY
	projectedMaxY = maxY
}

func clampIndex(value, max int) int {
	if value < 0 {
		return 0
	}
	if value > max {
		return max
	}
	return value
}

func gridCellFromLatLong(lat, long float64) (int, int) {
	projectionBoundsOnce.Do(loadProjectionBounds)

	x, y := projectAlbers(lat, long)

	xSpan := projectedMaxX - projectedMinX
	ySpan := projectedMaxY - projectedMinY
	if xSpan == 0 || ySpan == 0 {
		return 0, 0
	}

	xNorm := (x - projectedMinX) / xSpan
	yNorm := (y - projectedMinY) / ySpan

	col := clampIndex(int(math.Round(xNorm*float64(mapCols-1))), mapCols-1)
	row := clampIndex(int(math.Round((1-yNorm)*float64(mapRows-1))), mapRows-1)
	return row, col
}
