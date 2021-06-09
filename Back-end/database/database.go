package database

import (
	"database/sql"
	"fmt"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func CreateAndSelectDB(name string) {
	//Connexion au docker sql en root
	var err error
	db, err = sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/")

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	//Création de la bd
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

func CreateTable(nameDb string) {
	//Connexion à la bd sur le docker
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/"+nameDb)

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	//Création des tables
	tableau := [7]string{tableUserIdentity, tableUserProfile, tableUserPost, tableAllPosts, tableCategories, tableAllCommentary, tablePostCategory}
	for j := range tableau {
		_, error := db.Exec(tableau[j]) //A changer le mdp par la suite

		if error != nil {
			panic(error)
		} else {
			fmt.Println("Table " + strconv.Itoa(j+1) + " is create")
		}
	}
}

const tableUserIdentity = `CREATE TABLE IF NOT EXISTS userIdentity(
user_id INT AUTO_INCREMENT PRIMARY KEY,
user_email VARCHAR(50) NOT NULL,
user_pseudo VARCHAR(30) NOT NULL,
user_password VARCHAR(3000) NOT NULL,
user_birth VARCHAR(12) NOT NULL)`

const tableUserProfile = `CREATE TABLE IF NOT EXISTS userProfile(
user_id INT,
user_location VARCHAR(50) NULL,
user_image BINARY NULL,
user_bio TEXT NULL )`

const tableUserPost = `CREATE TABLE IF NOT EXISTS userPost(
user_id INT,
posts_id INT NOT NULL )`

const tableAllCommentary = `CREATE TABLE IF NOT EXISTS allCommentary(
commentary_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
post_id INT NOT NULL,
commentary_date DATE NOT NULL,
commentary_message TEXT NULL )`

const tableAllPosts = `CREATE TABLE IF NOT EXISTS allPosts (
post_id INT AUTO_INCREMENT PRIMARY KEY,
user_pseudo VARCHAR(50) NOT NULL,
user_id INT NOT NULL,
user_title VARCHAR(50) NULL,
user_message TEXT NULL,
post_image BINARY,
post_date VARCHAR(15) NULL,
post_hour VARCHAR(15) NOT NULL,
post_likes INT NULL,
post_dislikes INT NULL)`

const tableCategories = `CREATE TABLE IF NOT EXISTS categories(
category_id INT AUTO_INCREMENT PRIMARY KEY,
category_name VARCHAR(50) NOT NULL)`

const tablePostCategory = `CREATE TABLE IF NOT EXISTS postCategory (
post_id INT NOT NULL,
category_id INT NULL,
post_category VARCHAR(50)NULL)`
