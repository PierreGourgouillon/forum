package main

import "database/sql"
import _ "github.com/go-sql-driver/mysql"
import "fmt"

const tableIdentity = `CREATE TABLE IF NOT EXISTS identity(
user_id INT AUTO_INCREMENT PRIMARY KEY,
user_email VARCHAR(50) NOT NULL,
user_pseudo VARCHAR(50) NOT NULL,
user_password VARCHAR(50) NOT NULL )`

const tableProfile = `CREATE TABLE IF NOT EXISTS profile(
user_id INT AUTO_INCREMENT PRIMARY KEY,
user_location VARCHAR(50),
user_date DATE NOT NULL,
user_image BINARY,
user_bio TEXT )`

const tablePost = `CREATE TABLE IF NOT EXISTS post(
user_id INT AUTO_INCREMENT PRIMARY KEY,
posts_id INT)` // A modifier pour avoir un tableau

const tableCommentary = `CREATE TABLE IF NOT EXISTS commentary(
commentary_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
post_id INT,
commentary_date DATE,
commentary_message TEXT)`

const tableAllPosts = `CREATE TABLE IF NOT EXISTS allposts (
user_id INT AUTO_INCREMENT PRIMARY KEY,
user_pseudo VARCHAR(50),
user_message TEXT,
user_categories VARCHAR(100),
post_image BINARY, post_date DATE,
post_hour VARCHAR(20),
post_likes INT,
post_dislikes INT,
post_commentaries VARCHAR(200))`

const tableCategory = `CREATE TABLE IF NOT EXISTS category(
category_id INT AUTO_INCREMENT PRIMARY KEY,
category_name VARCHAR(50))`

func main() {
	createAndSelectDB("Forum")
	createTable("Forum")
}

func createAndSelectDB(name string) {
	//Connexion au docker sql en root
	db, err := sql.Open("mysql", "root:pierre@(127.0.0.1:49153)/")

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	//Création de bdla
	_, error := db.Exec("CREATE DATABASE IF NOT EXISTS " + name)

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

func createTable(nameDb string) {
	db, err := sql.Open("mysql", "root:pierre@(127.0.0.1:49153)/"+nameDb)

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
	tableau := [6]string{tableIdentity, tableProfile, tablePost, tableAllPosts, tableCategory, tableCommentary}
	for j := range tableau {
		_, error := db.Exec(tableau[j]) //A changer le mdp par la suite

		if error != nil {
			panic(error)
		} else {
			fmt.Println("Table Identity is create")
		}
	}
}
