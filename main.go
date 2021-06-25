package main

import (
	server "github.com/forum/Back-end/Server"
	"github.com/forum/Back-end/database"
)

func main() {
	database.CreateAndSelectDB("Forum.db")
	server.StartServer()
}
