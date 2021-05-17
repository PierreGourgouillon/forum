package main

import "database/sql"
import _ "github.com/go-sql-driver/mysql"
import "fmt"

func main() {
	createDB("AHA")
}

func createDB(name string) {
	// Configure the database connection (always check errors)
	db, err := sql.Open("mysql", "root:my-secret-pw@(127.0.0.1:49153)/")

	if err != nil {
		panic(err.Error()) // Just for example purpose. You should use proper error handling instead of panic
	}
	defer db.Close()

	a, err := db.Exec("CREATE DATABASE " + name)

	fmt.Println(a)

	if err != nil {
		panic(err)
	}

	_, b := db.Query("SHOW TABLES")
	fmt.Println(b)

	_, err = db.Exec("USE " + name)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("DB selected successfully..")
	}
}
