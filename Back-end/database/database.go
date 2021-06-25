package database

import (
	"database/sql"
	"fmt"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func CreateAndSelectDB(name string) {
	var err error
	db, err = sql.Open("sqlite3", name)
	if err != nil {
		panic(err)
	}

	CreateTable()
}

func CreateTable() {
	//Création des tables
	tableau := [8]string{tableUserIdentity, tableUserProfile, tableUserPost, tableAllPosts, tableCategories, tableAllCommentary, tablePostCategory, tablePostReactions}
	for j := range tableau {
		_, error := db.Exec(tableau[j]) //A changer le mdp par la suite

		if error != nil {
			panic(error)
		} else {
			fmt.Println("Table " + strconv.Itoa(j+1) + " is create")
		}
	}

	fillTableCategories()
}

const tableUserIdentity = `CREATE TABLE IF NOT EXISTS userIdentity(
user_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
user_email TEXT NOT NULL,
user_pseudo TEXT NOT NULL,
user_password TEXT NOT NULL,
user_birth TEXT NOT NULL,
deactivate INTEGER NOT NULL)`

const tableUserProfile = `CREATE TABLE IF NOT EXISTS userProfile(
user_id INTEGER,
user_location TEXT NULL,
user_image BLOB NULL,
user_bio TEXT NULL )`

const tableUserPost = `CREATE TABLE IF NOT EXISTS userPost(
user_id INTEGER,
posts_id INTEGER NOT NULL )`

const tableAllCommentary = `CREATE TABLE IF NOT EXISTS allCommentary(
commentary_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
post_id INTEGER NOT NULL,
commentary_date TEXT NOT NULL,
commentary_message TEXT NOT NULL )`

const tableAllPosts = `CREATE TABLE IF NOT EXISTS allPosts (
post_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
user_pseudo TEXT NOT NULL,
user_id INTEGER NOT NULL,
user_title TEXT NULL,
user_message TEXT NULL,
post_image BLOB,
post_date TEXT NULL,
post_hour TEXT NOT NULL,
post_likes INTEGER NULL,
post_dislikes INTEGER NULL)`

const tableCategories = `CREATE TABLE IF NOT EXISTS categories(
category_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
category_name TEXT NOT NULL)`

const tablePostCategory = `CREATE TABLE IF NOT EXISTS postCategory (
post_id INTEGER NOT NULL,
category_id INTEGER NULL,
post_category TEXT NULL)`

const tablePostReactions = `CREATE TABLE IF NOT EXISTS postReactions(
post_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
user_like INTEGER NOT NULL,
user_dislike INTEGER NOT NULL
)`

func fillTableCategories() {

	tabCat := []string{"Actualité", "Art", "Cinéma", "Histoire", "Humour", "Internet", "Jeux Vidéo", "Nourriture", "Santé", "Sport"}
	row := db.QueryRow("SELECT category_name FROM categories WHERE category_id = 1")

	var empty string
	row.Scan(&empty)

	if empty == "" {
		for _, cat := range tabCat {
			_, error := db.Exec("INSERT INTO categories (category_name) VALUES (?)", cat)
			if error != nil {
				fmt.Println(error)
			}
		}
	}

}
