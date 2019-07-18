package main

import (
	"fmt"
	"github.com/nicell/where-to-live/cmd"
)

func main() {
	err := cmd.Download()
	if err != nil {
		fmt.Println(err)
	}
}
