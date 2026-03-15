package main

import (
	"fmt"
	"os"

	"github.com/Nicell/where-to-live/cmd"
	"github.com/Nicell/where-to-live/cmd/parse"
)

func main() {
	if err := cmd.Download(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	parse.WriteJSON()
}
