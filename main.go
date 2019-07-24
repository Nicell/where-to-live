package main

import (
	"fmt"
	"time"

	"github.com/Nicell/where-to-live/cmd"
	"github.com/Nicell/where-to-live/cmd/parse"
)

func main() {
	err := cmd.Download()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(time.Now())
	parse.WriteJSON()
	fmt.Println(time.Now())
}
