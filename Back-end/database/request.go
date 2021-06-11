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

	id, err2 := data.LastInsertId()
	if err2 != nil {
		return
	}

	data2, err3 := db.Exec("INSERT INTO userProfile (user_id) VALUES (?)", id)
	if err3 != nil {
		return
	}

	fmt.Println(data, data2)
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

	res, error := db.Exec("INSERT INTO allPosts (user_pseudo, user_id, user_title, user_message, post_date, post_hour, post_likes, post_dislikes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", post.Pseudo, post.IdUser, post.Title, post.Message, post.Date, post.Hour, post.Like, post.Dislike)

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

	rows, error := db.Query("SELECT post_id, user_title, user_pseudo, user_id, user_message, post_date, post_hour, post_likes, post_dislikes FROM allPosts")
	defer db.Close()

	if error != nil {
		log.Fatal(error)
	}

	for rows.Next() {
		var post structs.Post
		rows.Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Date, &post.Hour, &post.Like, &post.Dislike)
		allPost = append(allPost, post)
	}

	return allPost
}

func FindPostById(id int) structs.Post {

	var post structs.Post

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	query := "SELECT post_id, user_title, user_pseudo, user_id, user_message, post_date, post_hour, post_likes, post_dislikes FROM allPosts WHERE post_id= ?"

	err = db.QueryRow(query, id).Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Date, &post.Hour, &post.Like, &post.Dislike)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(post)

	return post
}

func UpdatePost(id int, post *structs.Post) {
	var postUpdate structs.Post
	postBasic := FindPostById(id)

	if post.Message != postBasic.Message && post.Message != "" {
		postUpdate.Message = post.Message
	} else {
		postUpdate.Message = postBasic.Message
	}

	if post.Title != postBasic.Title && post.Title != "" {
		postUpdate.Title = post.Title
	} else {
		postUpdate.Title = postBasic.Title
	}

	if post.Like != postBasic.Like && post.Like != -1 {
		postUpdate.Like = post.Like
	} else {
		postUpdate.Like = postBasic.Like
	}

	if post.Dislike != postBasic.Dislike && post.Dislike != -1 {
		postUpdate.Dislike = post.Dislike
	} else {
		postUpdate.Dislike = postBasic.Dislike
	}

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	query := "UPDATE allPosts SET user_message= ?, user_title= ?, post_likes= ?, post_dislikes= ? WHERE post_id= ?"

	_, err = db.Exec(query, postUpdate.Message, postUpdate.Title, postUpdate.Like, postUpdate.Dislike, id)

	if err != nil {
		log.Fatal(err)
	}
}

func DeletePost(id int) bool {
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}
	query := "DELETE FROM allPosts WHERE post_id= ?"
	_, err = db.Exec(query, id)
	if err != nil {
		return false
	}

	return true
}

func GetAllReactions() []structs.Reaction {
	var reactions []structs.Reaction

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	rows, error := db.Query("SELECT post_id, user_id, user_like, user_dislike FROM postReactions")
	defer db.Close()

	if error != nil {
		log.Fatal(error)
	}

	for rows.Next() {
		var reaction structs.Reaction
		rows.Scan(&reaction.PostId, &reaction.IdUser, &reaction.Like, &reaction.Dislike)
		reactions = append(reactions, reaction)
	}

	return reactions
}

func CreateReaction(reaction structs.Reaction) bool {
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	_, error := db.Exec("INSERT INTO postReactions (post_id, user_id, user_like, user_dislike) VALUES (?, ?, ?, ?)", reaction.PostId, reaction.IdUser, reaction.Like, reaction.Dislike)

	if error != nil {
		return false
	}

	return true
}

func GetReactionsOnePost(id int) []structs.Reaction {
	var reactions []structs.Reaction

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	rows, error := db.Query("SELECT post_id, user_id, user_like, user_dislike FROM postReactions WHERE post_id= ?", id)
	defer db.Close()

	if error != nil {
		log.Fatal(error)
	}

	for rows.Next() {
		var reaction structs.Reaction
		rows.Scan(&reaction.PostId, &reaction.IdUser, &reaction.Like, &reaction.Dislike)
		reactions = append(reactions, reaction)
	}

	return reactions
}

func UpdateReactionOnePost(idPost int, reactionpost structs.Reaction) bool {

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	query := "UPDATE postReactions SET user_like= ?, user_dislike= ? WHERE post_id= ? AND user_id= ?"

	_, err = db.Exec(query, reactionpost.Like, reactionpost.Dislike, idPost, reactionpost.IdUser)

	if err != nil {
		return false
	}
	return true
}

func GetPostsByUserID(id int) []structs.Post {
	var allPost []structs.Post

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}

	rows, error := db.Query("SELECT post_id, user_title, user_pseudo, user_id, user_message, post_date, post_hour, post_likes, post_dislikes FROM allPosts WHERE user_id = ?", id)
	defer db.Close()

	if error != nil {
		log.Fatal(error)
	}

	for rows.Next() {
		var post structs.Post
		rows.Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Date, &post.Hour, &post.Like, &post.Dislike)
		allPost = append(allPost, post)
	}

	return allPost
}

func GetNumberOfUsers() int {
	var nbr int

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	res := db.QueryRow("SELECT COUNT(*) FROM userIdentity")

	res.Scan(&nbr)

	return nbr
}

func GetProfilByUserID(id int) structs.ProfilUser {
	var profil structs.ProfilUser

	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	data := db.QueryRow("SELECT user_pseudo FROM userIdentity WHERE user_id = ?", id)
	data.Scan(&profil.Pseudo)

	data = db.QueryRow("SELECT user_location, user_bio FROM userProfile WHERE user_id = ?", id)
	data.Scan(&profil.Location, &profil.Bio)

	return profil
}

func UpdateBioByUserID(id int, bio string) bool {
	db, err := sql.Open("mysql", "root:foroumTwitter@(127.0.0.1:6677)/Forum")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	query := "UPDATE userProfile SET user_bio= ? WHERE user_id= ?"

	_, err = db.Exec(query, bio, id)

	if err != nil {
		return false
	}

	return true
}
