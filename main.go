package main

import (
	"fmt"
	"github.com/Nicell/where-to-live/cmd"
)

func main() {
	err := cmd.Download()
	if err != nil {
		fmt.Println(err)
	}
}
