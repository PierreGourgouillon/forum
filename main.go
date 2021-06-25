package main

import (
	server "forum/Back-end/Server"
	"forum/Back-end/database"
)

func main() {
	database.CreateAndSelectDB("Forum.db")
	server.StartServer()
}
