package parse

import "testing"

func TestFillDeadSpaceFillsOrthogonallyEnclosedGap(t *testing.T) {
	var mapUS [mapRows][mapCols][]zip

	mapUS[39][80] = []zip{{name: "NORTH"}}
	mapUS[41][80] = []zip{{name: "SOUTH"}}
	mapUS[40][79] = []zip{{name: "WEST"}}
	mapUS[40][81] = []zip{{name: "EAST"}}

	filled, err := fillDeadSpace(mapUS)
	if err != nil {
		t.Fatalf("fillDeadSpace returned error: %v", err)
	}

	if len(filled[40][80]) != 1 {
		t.Fatalf("len(filled[40][80]) = %d, want 1", len(filled[40][80]))
	}
	if filled[40][80][0].name != "Unknown" {
		t.Fatalf("filled[40][80][0].name = %q, want %q", filled[40][80][0].name, "Unknown")
	}
}

func TestFillDeadSpaceLeavesOpenGapEmpty(t *testing.T) {
	var mapUS [mapRows][mapCols][]zip

	mapUS[39][80] = []zip{{name: "NORTH"}}
	mapUS[41][80] = []zip{{name: "SOUTH"}}
	mapUS[40][79] = []zip{{name: "WEST"}}

	filled, err := fillDeadSpace(mapUS)
	if err != nil {
		t.Fatalf("fillDeadSpace returned error: %v", err)
	}

	if len(filled[40][80]) != 0 {
		t.Fatalf("len(filled[40][80]) = %d, want 0", len(filled[40][80]))
	}
}

func TestFillDeadSpaceFillsEnclosedRegion(t *testing.T) {
	var mapUS [mapRows][mapCols][]zip

	for col := 20; col <= 24; col++ {
		mapUS[10][col] = []zip{{name: "TOP"}}
		mapUS[14][col] = []zip{{name: "BOTTOM"}}
	}
	for row := 10; row <= 14; row++ {
		mapUS[row][20] = []zip{{name: "LEFT"}}
		mapUS[row][24] = []zip{{name: "RIGHT"}}
	}

	filled, err := fillDeadSpace(mapUS)
	if err != nil {
		t.Fatalf("fillDeadSpace returned error: %v", err)
	}

	for row := 11; row <= 13; row++ {
		for col := 21; col <= 23; col++ {
			if len(filled[row][col]) != 1 {
				t.Fatalf("len(filled[%d][%d]) = %d, want 1", row, col, len(filled[row][col]))
			}
			if filled[row][col][0].name != "Unknown" {
				t.Fatalf("filled[%d][%d][0].name = %q, want %q", row, col, filled[row][col][0].name, "Unknown")
			}
		}
	}
}

func TestFillDeadSpaceFillsLargeCompactEnclosedRegion(t *testing.T) {
	var mapUS [mapRows][mapCols][]zip

	for col := 20; col <= 27; col++ {
		mapUS[10][col] = []zip{{name: "TOP"}}
		mapUS[17][col] = []zip{{name: "BOTTOM"}}
	}
	for row := 10; row <= 17; row++ {
		mapUS[row][20] = []zip{{name: "LEFT"}}
		mapUS[row][27] = []zip{{name: "RIGHT"}}
	}

	filled, err := fillDeadSpace(mapUS)
	if err != nil {
		t.Fatalf("fillDeadSpace returned error: %v", err)
	}

	for row := 11; row <= 16; row++ {
		for col := 21; col <= 26; col++ {
			if len(filled[row][col]) != 1 {
				t.Fatalf("len(filled[%d][%d]) = %d, want 1", row, col, len(filled[row][col]))
			}
		}
	}
}
