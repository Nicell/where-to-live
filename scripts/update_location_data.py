#!/usr/bin/env python3

import csv
import io
import json
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TMP = Path("/tmp/where-to-live-data")
DATA = ROOT / "data"


def build_state_rows():
    rows = []
    with (TMP / "census_state.txt").open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="|")
        for row in reader:
            rows.append((row["STATE_NAME"], row["STUSAB"], str(int(row["STATE"]))))
    rows.sort(key=lambda row: int(row[2]))
    return rows


def build_state_lookup(state_rows):
    by_abbrev = {}
    for _, abbrev, state_fips in state_rows:
        by_abbrev[abbrev] = state_fips
    return by_abbrev


def build_population_rows():
    with (TMP / "acs2024_zcta_population.json").open(encoding="utf-8") as f:
        raw = json.load(f)

    rows = []
    for population, zcta in raw[1:]:
        if population in (None, ""):
            population = "0"
        rows.append((zcta, population))
    rows.sort(key=lambda row: row[0])
    return rows


def build_zip_rows(state_lookup):
    rows = []
    with zipfile.ZipFile(TMP / "geonames_us.zip") as zf:
        with zf.open("US.txt") as f:
            wrapper = io.TextIOWrapper(f, encoding="utf-8")
            reader = csv.reader(wrapper, delimiter="\t")
            for row in reader:
                if len(row) < 12:
                    continue

                postal_code = row[1].zfill(5)
                place_name = row[2].upper()
                state_abbrev = row[4]
                county_code = row[6].zfill(3)
                latitude = f"{float(row[9]):+010.6f}"
                longitude = f"{float(row[10]):+011.6f}"

                state_fips = state_lookup.get(state_abbrev)
                if not state_fips:
                    continue

                rows.append(
                    (
                        postal_code,
                        latitude,
                        longitude,
                        "",
                        place_name,
                        state_fips.zfill(2),
                        county_code,
                    )
                )

    rows.sort(key=lambda row: row[0])
    return rows


def write_csv(path, rows, header=None):
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, lineterminator="\n")
        if header is not None:
            writer.writerow(header)
        writer.writerows(rows)


def write_tsv(path, rows):
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, delimiter="\t", lineterminator="\n")
        writer.writerows(rows)


def main():
    state_rows = build_state_rows()
    state_lookup = build_state_lookup(state_rows)
    population_rows = build_population_rows()
    zip_rows = build_zip_rows(state_lookup)

    write_csv(DATA / "states.csv", state_rows)
    write_csv(
        DATA / "population-by-zip.csv",
        population_rows,
        header=("Zip Code ZCTA", "2024 ACS 5-Year Population"),
    )
    write_tsv(DATA / "zips.tsv", zip_rows)

    print(f"wrote {len(state_rows)} states")
    print(f"wrote {len(population_rows)} population rows")
    print(f"wrote {len(zip_rows)} zip rows")


if __name__ == "__main__":
    main()
