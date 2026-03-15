package cmd

import (
	"fmt"
	"io"
	"os"

	"github.com/cheggaaa/pb/v3"
	"github.com/gookit/color"
	"github.com/jlaffaye/ftp"
)

const (
	datasetStartYear = 2010
	datasetEndYear   = 2024
)

// Download retrieves all weather data
func Download() error {
	for i := datasetStartYear; i <= datasetEndYear; i++ {
		err := DownloadYear(i, false)
		if err != nil {
			return err
		}
	}

	err := DownloadFile("/pub/data/noaa/isd-history.csv", "data/isd-history.csv", false)
	if err != nil {
		return err
	}

	err = DownloadFile("/pub/data/noaa/isd-inventory.csv.z", "data/isd-history.csv.z", false)
	if err != nil {
		return err
	}

	return nil
}

// DownloadYear given year's weather data
func DownloadYear(yr int, refresh bool) error {
	loc := fmt.Sprintf("/pub/data/gsod/%d/gsod_%d.tar", yr, yr)
	dest := fmt.Sprintf("data/gsod_%d.tar", yr)
	err := DownloadFile(loc, dest, refresh)
	if err != nil {
		return err
	}

	return nil
}

// DownloadFile from location to destination via ftp
func DownloadFile(loc, dest string, refresh bool) error {
	color.Style{color.FgCyan, color.OpBold}.Printf("\nDownloading %s:\n", dest)

	if !refresh {
		if _, err := os.Stat(dest); err == nil {
			color.Info.Println("Skipped: File already downloaded.")
			return nil
		} else if !os.IsNotExist(err) {
			return err
		}
	}

	if refresh {
		color.Info.Println("Refreshing latest archive.")
	}

	conn, err := ftp.Dial("ftp.ncdc.noaa.gov:21")
	if err != nil {
		return err
	}
	defer conn.Quit()

	err = conn.Login("anonymous", "anonymous")
	if err != nil {
		return err
	}

	size, err := conn.FileSize(loc)
	if err != nil {
		return err
	}

	tmpl := `{{percent . }} ({{counters . }}) {{ bar . "[" "=" ">" " " "]" }} {{speed . }} {{rtime . "ETA %s" }}`
	bar := pb.ProgressBarTemplate(tmpl).Start64(size)
	defer bar.Finish()

	resp, err := conn.Retr(loc)
	if err != nil {
		return err
	}
	defer resp.Close()

	barReader := bar.NewProxyReader(resp)
	defer barReader.Close()

	out, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, barReader)
	return err
}
