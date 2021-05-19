package main

import(
	"github.com/forum/Back-end/database"
)

func main()  {
	database.CreateAndSelectDB("Forum")
	database.CreateTable("Forum")
}
