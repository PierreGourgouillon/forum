package database

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"github.com/forum/Back-end/password"
	"github.com/forum/Back-end/structs"
)

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
	data, err := db.Exec("INSERT INTO userIdentity (user_email, user_pseudo, user_password, user_birth) VALUES (?, ?, ?, ?)", user.Email, user.Pseudo, user.MotDePasse, user.Birth)
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
