package database

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"github.com/forum/Back-end/password"
	"github.com/forum/Back-end/structs"
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
user_birth DATE NOT NULL)`

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

func GetEmailList() []string {
	EmailList := []string{}

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	data, err := db.Query("SELECT user_email FROM userIdentity")
	defer db.Close()
	if err != nil {
		return []string{}
	}

	for data.Next() {
		var email string
		data.Scan(&email)
		EmailList = append(EmailList, email)
	}

	return EmailList
}

func InsertNewUser(user structs.Register) {
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	user.MotDePasse, _ = password.HashPassword(user.MotDePasse)
	var date string = user.Year + "-" + user.Month + "-" + user.Day
	fmt.Println(date)
	data, err := db.Exec("INSERT INTO userIdentity (user_email, user_pseudo, user_password, user_birth) VALUES (?, ?, ?, ?)", user.Email, user.Pseudo, user.MotDePasse, date)
	if err != nil {
		return
	}

	fmt.Println(data)
}

func GetPasswordByEmail(email string) string {
	var password string
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	data := db.QueryRow("SELECT user_password FROM userIdentity WHERE user_email = ?", email)

	if err != nil {
		fmt.Println(err)
	}

	data.Scan(&password)
	return password
}

func GetIdByEmail(email string) string {
	var ID int
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")

	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	data := db.QueryRow("SELECT user_id FROM userIdentity WHERE user_email = ?", email)

	if err != nil {
		fmt.Println(err)
	}

	data.Scan(&ID)
	return strconv.Itoa(ID)
}

func GetIdentityUser(valueCookie string) structs.UserIdentity {
	var idUser int
	var user structs.UserIdentity

	if valueCookie != "" {
		var err error
		idUser, err = strconv.Atoi(valueCookie)

		if err != nil {
			log.Fatal(err)
		}
	}

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	query := "SELECT user_email, user_pseudo, user_birth FROM userIdentity WHERE user_id= ?"
	errorDB := db.QueryRow(query, idUser).Scan(&user.Email, &user.Pseudo, &user.Birth)

	if errorDB != nil {
		log.Fatal(errorDB)
	}

	user.ID = idUser

	return user
}

func InsertPost(post *structs.Post) int64 {
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	res, error := db.Exec("INSERT INTO allPosts (user_pseudo, user_id, user_message, post_date, post_hour, post_likes, post_dislikes) VALUES (?, ?, ?, ?, ?, ?, ?)", post.Pseudo, post.IdUser, post.Message, post.Date, post.Hour, post.Like, post.Dislike)

	if error != nil {
		log.Fatal(error)
	}

	id, error := res.LastInsertId()

	if error != nil {
		log.Fatal(error)
	}

	return id
}

func GetAllPosts() []structs.Post {
	var allPost []structs.Post

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	rows, error := db.Query("SELECT post_id, user_pseudo, user_id, user_message, post_date, post_hour, post_likes, post_dislikes FROM allPosts")
	defer db.Close()

	if error != nil {
		log.Fatal(error)
	}

	for rows.Next() {
		var post structs.Post
		rows.Scan(&post.PostId, &post.Pseudo, &post.IdUser, &post.Message, &post.Date, &post.Hour, &post.Like, &post.Dislike)
		fmt.Println(post.PostId)
		allPost = append(allPost, post)
	}

	return allPost
}
