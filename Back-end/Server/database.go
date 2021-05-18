package main

import "database/sql"
import _ "github.com/go-sql-driver/mysql"
import "fmt"

func main() {
	createAndSelectDB("testD")
}

func createAndSelectDB(name string) {
	//Connexion au docker sql en root
	db, err := sql.Open("mysql", "root:pierre@(127.0.0.1:49153)/")

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	//Création de bdla
	_, error := db.Exec("CREATE DATABASE " + name)

	if error != nil {
		panic(err)
	} else {
		fmt.Println("DATABASE " + name + " is create")
	}

	//Selectionne la bd
	_, err = db.Exec("USE " + name)
	if err != nil {
		panic(err)
	} else {
		fmt.Println("DB selected successfully..")
	}
}
