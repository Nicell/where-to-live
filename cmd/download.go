package cmd

import (
	"fmt"
	"io"
	"os"
	"time"

	"github.com/jlaffaye/ftp"
)

// Download retrieves all weather data
func Download() error {
	for i := 1990; i < time.Now().Year(); i++ {
		fmt.Printf("Downloading weather data for %d... ", i)
		err := DownloadYear(i)
		if err != nil {
			return err
		}
		fmt.Println("DONE")
	}

	fmt.Print("Downloading isd-history... ")
	err := DownloadFile("/pub/data/noaa/isd-history.csv", "data/isd-history.csv")
	if err != nil {
		return err
	}
	fmt.Println("DONE")

	fmt.Print("Downloading isd-inventory... ")
	err = DownloadFile("/pub/data/noaa/isd-inventory.csv.z", "data/isd-history.csv.z")
	if err != nil {
		return err
	}
	fmt.Println("DONE")

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

		resp, err := conn.Retr(loc)
		if err != nil {
			return err
		}
		defer resp.Close()

		out, err := os.Create(dest)
		if err != nil {
			return err
		}
		defer out.Close()

		_, err = io.Copy(out, resp)
		return err
	}
	return nil
}
