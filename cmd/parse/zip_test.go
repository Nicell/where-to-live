package parse

import "testing"

func TestFillDeadSpaceFillsOrthogonallyEnclosedGap(t *testing.T) {
	var mapUS [50][116][]zip

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
	var mapUS [50][116][]zip

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
