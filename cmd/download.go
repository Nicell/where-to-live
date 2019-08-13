package cmd

import (
	"fmt"
	"io"
	"os"
	"time"

	"github.com/cheggaaa/pb/v3"
	"github.com/gookit/color"
	"github.com/jlaffaye/ftp"
)

// Download retrieves all weather data
func Download() error {
	for i := 1990; i < time.Now().Year(); i++ {
		err := DownloadYear(i)
		if err != nil {
			return err
		}
	}

	err := DownloadFile("/pub/data/noaa/isd-history.csv", "data/isd-history.csv")
	if err != nil {
		return err
	}

	err = DownloadFile("/pub/data/noaa/isd-inventory.csv.z", "data/isd-history.csv.z")
	if err != nil {
		return err
	}

	return nil
}

// DownloadYear given year's weather data
func DownloadYear(yr int) error {
	loc := fmt.Sprintf("/pub/data/gsod/%d/gsod_%d.tar", yr, yr)
	dest := fmt.Sprintf("data/gsod_%d.tar", yr)
	err := DownloadFile(loc, dest)
	if err != nil {
		return err
	}

	return nil
}

// DownloadFile from location to destination via ftp
func DownloadFile(loc, dest string) error {
	color.Style{color.FgCyan, color.OpBold}.Printf("\nDownloading %s:\n", dest)

	if _, err := os.Stat(dest); os.IsNotExist(err) {
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
	} else {
		color.Info.Println("Skipped: File already downloaded.")
	}
	return nil
}
