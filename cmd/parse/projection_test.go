package parse

import "testing"

func TestGridCellFromLatLongRespectsUSOrientation(t *testing.T) {
	seattleRow, seattleCol := gridCellFromLatLong(47.6062, -122.3321)
	miamiRow, miamiCol := gridCellFromLatLong(25.7617, -80.1918)
	_, bostonCol := gridCellFromLatLong(42.3601, -71.0589)

	if seattleCol >= bostonCol {
		t.Fatalf("Seattle column = %d, Boston column = %d, want Seattle west of Boston", seattleCol, bostonCol)
	}
	if miamiRow <= seattleRow {
		t.Fatalf("Miami row = %d, Seattle row = %d, want Miami south of Seattle", miamiRow, seattleRow)
	}
	if miamiCol >= bostonCol {
		t.Fatalf("Miami column = %d, Boston column = %d, want Miami west of Boston", miamiCol, bostonCol)
	}
	if seattleRow < 0 || seattleRow >= mapRows || seattleCol < 0 || seattleCol >= mapCols {
		t.Fatalf("Seattle projected out of bounds: row=%d col=%d", seattleRow, seattleCol)
	}
}
