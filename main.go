package main

import (
	"fmt"
	"github.com/Nicell/where-to-live/cmd/parse"
	"time"
)

func main() {
	//err := cmd.Download()
	//if err != nil {
	//	fmt.Println(err)
	fmt.Println(time.Now())
	parse.WriteJSON()
	fmt.Println(time.Now())
}
