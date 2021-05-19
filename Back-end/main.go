package main

import (
	server "github.com/forum/Back-end/Server"
	"github.com/forum/Back-end/database"
)

func main() {
	database.CreateAndSelectDB("Forum")
	database.CreateTable("Forum")
	server.StartServer()
}
