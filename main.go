package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/Nicell/where-to-live/cmd"
	"github.com/Nicell/where-to-live/cmd/parse"
)

func main() {
	weatherDebug := flag.Bool("weather-debug", false, "print weather classification debug summaries")
	flag.Parse()
	parse.SetWeatherDebug(*weatherDebug)

	if err := cmd.Download(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	parse.WriteJSON()
}
