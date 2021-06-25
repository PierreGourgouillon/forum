package database

import (
	"fmt"
	"strconv"

	"forum/Back-end/password"
	"forum/Back-end/structs"
)

func GetEmailList() []string {
	EmailList := []string{}

	data, err := db.Query("SELECT user_email FROM userIdentity")

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
	user.MotDePasse, _ = password.HashPassword(user.MotDePasse)
	data, err := db.Exec("INSERT INTO userIdentity (user_email, user_pseudo, user_password, user_birth, deactivate) VALUES (?, ?, ?, ?, false)", user.Email, user.Pseudo, user.MotDePasse, user.Birth)
	if err != nil {
		return
	}

	id, err2 := data.LastInsertId()
	if err2 != nil {
		return
	}

	_, err3 := db.Exec("INSERT INTO userProfile (user_id) VALUES (?)", id)
	if err3 != nil {
		return
	}

}

func GetPasswordByEmail(email string) string {
	var password string

	data := db.QueryRow("SELECT user_password FROM userIdentity WHERE user_email = ?", email)

	data.Scan(&password)
	return password
}

func GetIdByEmail(email string) string {
	var ID int

	data := db.QueryRow("SELECT user_id FROM userIdentity WHERE user_email = ?", email)

	data.Scan(&ID)
	return strconv.Itoa(ID)
}

func IsDeactivate(id int) bool {
	var isDeactivate bool

	data := db.QueryRow("SELECT deactivate FROM userIdentity WHERE user_id = ?", id)

	data.Scan(&isDeactivate)

	return isDeactivate

}

func GetIdentityUser(valueCookie string) structs.UserIdentity {
	var idUser int
	var user structs.UserIdentity

	if valueCookie != "" {
		var err error
		idUser, err = strconv.Atoi(valueCookie)

		if err != nil {
			return user
		}
	}

	query := "SELECT user_email, user_pseudo, user_birth FROM userIdentity WHERE user_id= ?"
	errorDB := db.QueryRow(query, idUser).Scan(&user.Email, &user.Pseudo, &user.Birth)

	if errorDB != nil {
		return user
	}

	user.ID = idUser

	return user
}

func InsertPost(post *structs.Post) int64 {

	res, error := db.Exec("INSERT INTO allPosts (user_pseudo, user_id, user_title, user_message, post_image, post_date, post_hour, post_likes, post_dislikes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", post.Pseudo, post.IdUser, post.Title, post.Message, post.Image, post.Date, post.Hour, post.Like, post.Dislike)

	if error != nil {
		return 0
	}

	id, error := res.LastInsertId()

	for i := 0; i < len(post.Categories); i++ {
		insertCategories(int(id), post.Categories[i])
	}

	if error != nil {
		return 0
	}

	return id
}

func insertCategories(id int, cat string) {
	var catId int

	rows := db.QueryRow("SELECT category_id FROM categories WHERE category_name = ?", cat)
	rows.Scan(&catId)

	_, error := db.Exec("INSERT INTO postCategory (post_id, category_id, post_category) VALUES (?, ?, ?)", id, catId, cat)
	if error != nil {
		fmt.Println(error)
	}
}

func GetCategoriesID(cats []string) []string {
	var tabCatsID []string

	for _, cat := range cats {
		var id int
		catRow := db.QueryRow("SELECT category_id FROM categories WHERE category_name = ?", cat)
		catRow.Scan(&id)
		tabCatsID = append(tabCatsID, strconv.Itoa(id))
	}

	return tabCatsID
}

func GetAllPosts() []structs.Post {
	var allPost []structs.Post

	rows, error := db.Query("SELECT post_id, user_title, user_pseudo, user_id, user_message, post_image, post_date, post_hour, post_likes, post_dislikes FROM allPosts")

	if error != nil {
		fmt.Println(error)
	}

	for rows.Next() {
		var post structs.Post
		rows.Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Image, &post.Date, &post.Hour, &post.Like, &post.Dislike)

		catRows, err := db.Query("SELECT category_id FROM postCategory WHERE post_id = ?", post.PostId)

		if err != nil {
			fmt.Println(err)
		}

		var cats []string
		for catRows.Next() {
			var cat string
			catRows.Scan(&cat)
			cats = append(cats, cat)
		}
		post.Categories = cats

		allPost = append(allPost, post)
	}

	return allPost
}

// idFiltre est la metode de rangement
func GetAllPostsTrie(idFilter string) []structs.Post {
	var allPost []structs.Post
	var save string

	println(idFilter)

	if idFilter == "1" {
		println("idFilter:", idFilter)
		println("fonction:plus vieux au plus recent")
		save = "post_date ASC, post_hour DESC" //plus vieux au plus recent
	} else if idFilter == "2" {
		println("idFilter:", idFilter)
		println("du plus recent au plus vieux")
		save = "post_date DESC, post_hour ASC" //plus recent au plus vieux
	} else if idFilter == "3" {
		println("idFilter:", idFilter)
		println("fonction:plus like au moins like")
		save = "post_likes ASC, post_dislikes DESC" //les plus like
	} else if idFilter == "4" {
		println("idFilter:", idFilter)
		println("fonction: moins like au plus like")
		save = "post_dislikes ASC, post_likes DESC" //moins like d'abord

	}
	rows, error := db.Query("SELECT post_id, user_title, user_pseudo, user_id, user_message, post_image, post_date, post_hour, post_likes, post_dislikes FROM allPosts ORDER BY " + save)

	if error != nil {
		fmt.Println(error)
	}

	for rows.Next() {
		var post structs.Post
		rows.Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Image, &post.Date, &post.Hour, &post.Like, &post.Dislike)

		catRows, err := db.Query("SELECT category_id FROM postCategory WHERE post_id = ?", post.PostId)

		if err != nil {
			fmt.Println(err)
		}

		var cats []string
		for catRows.Next() {
			var cat string
			catRows.Scan(&cat)
			cats = append(cats, cat)
		}
		post.Categories = cats

		allPost = append(allPost, post)
	}
	return allPost
}

func FindPostById(id int) structs.Post {

	var post structs.Post

	query := "SELECT post_id, user_title, user_pseudo, user_id, user_message, post_image, post_date, post_hour, post_likes, post_dislikes FROM allPosts WHERE post_id= ?"

	err := db.QueryRow(query, id).Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Image, &post.Date, &post.Hour, &post.Like, &post.Dislike)

	if err != nil {
		fmt.Println(err)
	}

	catRows, err := db.Query("SELECT category_id FROM postCategory WHERE post_id = ?", post.PostId)

	if err != nil {
		fmt.Println(err)
	}

	var cats []string
	for catRows.Next() {
		var cat string
		catRows.Scan(&cat)
		cats = append(cats, cat)
	}
	post.Categories = cats

	return post
}

func UpdatePost(id int, post *structs.Post) bool {
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

	query := "UPDATE allPosts SET user_message= ?, user_title= ?, post_likes= ?, post_dislikes= ? WHERE post_id= ?"

	_, err := db.Exec(query, postUpdate.Message, postUpdate.Title, postUpdate.Like, postUpdate.Dislike, id)

	if err != nil {
		return false
	}

	return true
}

func DeletePost(id int) bool {

	query := "DELETE FROM allPosts WHERE post_id= ?"
	_, err := db.Exec(query, id)
	if err != nil {
		return false
	}

	query = "DELETE FROM postReactions WHERE post_id= ?"
	_, err = db.Exec(query, id)
	if err != nil {
		return false
	}

	return true
}

func GetAllReactions() []structs.Reaction {
	var reactions []structs.Reaction

	rows, error := db.Query("SELECT post_id, user_id, user_like, user_dislike FROM postReactions")

	if error != nil {
		fmt.Println(error)
	}

	for rows.Next() {
		var reaction structs.Reaction
		rows.Scan(&reaction.PostId, &reaction.IdUser, &reaction.Like, &reaction.Dislike)
		reactions = append(reactions, reaction)
	}

	return reactions
}

func CreateReaction(reaction structs.Reaction) bool {

	_, error := db.Exec("INSERT INTO postReactions (post_id, user_id, user_like, user_dislike) VALUES (?, ?, ?, ?)", reaction.PostId, reaction.IdUser, reaction.Like, reaction.Dislike)

	if error != nil {
		return false
	}

	return true
}

func GetReactionsOnePost(id int) []structs.Reaction {
	var reactions []structs.Reaction

	rows, error := db.Query("SELECT post_id, user_id, user_like, user_dislike FROM postReactions WHERE post_id= ?", id)

	if error != nil {
		fmt.Println(error)
	}

	for rows.Next() {
		var reaction structs.Reaction
		rows.Scan(&reaction.PostId, &reaction.IdUser, &reaction.Like, &reaction.Dislike)
		reactions = append(reactions, reaction)
	}

	return reactions
}

func UpdateReactionOnePost(idPost int, reactionpost structs.Reaction) bool {

	query := "UPDATE postReactions SET user_like= ?, user_dislike= ? WHERE post_id= ? AND user_id= ?"

	_, err := db.Exec(query, reactionpost.Like, reactionpost.Dislike, idPost, reactionpost.IdUser)

	if err != nil {
		return false
	}

	return true
}

func GetPostsByUserID(id int) []structs.Post {
	var allPost []structs.Post

	rows, error := db.Query("SELECT post_id, user_title, user_pseudo, user_id, user_message, post_image, post_date, post_hour, post_likes, post_dislikes FROM allPosts WHERE user_id = ?", id)

	if error != nil {
		fmt.Println(error)
	}

	for rows.Next() {
		var post structs.Post
		rows.Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Image, &post.Date, &post.Hour, &post.Like, &post.Dislike)

		catRows, err := db.Query("SELECT category_id FROM postCategory WHERE post_id = ?", post.PostId)

		if err != nil {
			fmt.Println(err)
		}

		var cats []string
		for catRows.Next() {
			var cat string
			catRows.Scan(&cat)
			cats = append(cats, cat)
		}
		post.Categories = cats

		allPost = append(allPost, post)
	}

	return allPost
}

func GetPostsLikedByUserID(id int) []structs.Post {
	var allPost []structs.Post
	var tab []int

	data, err := db.Query("SELECT post_id FROM postReactions WHERE user_id = ? AND (user_like > 0 OR user_dislike > 0)", id)
	if err != nil {
		return allPost
	}

	for data.Next() {
		var num int
		data.Scan(&num)
		tab = append(tab, num)
	}

	allPost = GetPostWithArray(tab)

	return allPost
}

func GetPostWithArray(tab []int) []structs.Post {
	var allPost []structs.Post

	for _, num := range tab {
		var post structs.Post

		data := db.QueryRow("SELECT post_id, user_title, user_pseudo, user_id, user_message, post_image, post_date, post_hour, post_likes, post_dislikes FROM allPosts WHERE post_id = ?", num)
		data.Scan(&post.PostId, &post.Title, &post.Pseudo, &post.IdUser, &post.Message, &post.Image, &post.Date, &post.Hour, &post.Like, &post.Dislike)

		catRows, err := db.Query("SELECT category_id FROM postCategory WHERE post_id = ?", post.PostId)

		if err != nil {
			fmt.Println(err)
		}

		var cats []string
		for catRows.Next() {
			var cat string
			catRows.Scan(&cat)
			cats = append(cats, cat)
		}
		post.Categories = cats

		allPost = append(allPost, post)
	}

	return allPost
}

func GetNumberOfUsers() int {
	var nbr int

	res := db.QueryRow("SELECT COUNT(*) FROM userIdentity")

	res.Scan(&nbr)

	return nbr
}

func GetProfilByUserID(id int) structs.ProfilUser {
	var profil structs.ProfilUser

	data := db.QueryRow("SELECT user_pseudo FROM userIdentity WHERE user_id = ?", id)
	data.Scan(&profil.Pseudo)

	data2 := db.QueryRow("SELECT user_location FROM userProfile WHERE user_id = ?", id)
	data2.Scan(&profil.Location)

	data3 := db.QueryRow("SELECT user_bio FROM userProfile WHERE user_id = ?", id)
	data3.Scan(&profil.Bio)

	data4 := db.QueryRow("SELECT user_image FROM userProfile WHERE user_id = ?", id)
	data4.Scan(&profil.Image)

	data5 := db.QueryRow("SELECT user_email FROM userIdentity WHERE user_id = ?", id)
	data5.Scan(&profil.Email)

	data6 := db.QueryRow("SELECT user_birth FROM userIdentity WHERE user_id = ?", id)
	data6.Scan(&profil.Birth)

	return profil
}

func UpdateBioByUserID(id int, bio string) bool {

	query := "UPDATE userProfile SET user_bio= ? WHERE user_id= ?"

	_, err := db.Exec(query, bio, id)

	if err != nil {
		return false
	}

	return true
}

func GetTitles() []string {
	var Titles []string

	data, err := db.Query("SELECT user_title FROM allPosts")

	if err != nil {
		fmt.Println(err)
		return []string{}
	}

	for data.Next() {
		var title string
		data.Scan(&title)
		Titles = append(Titles, title)
	}

	return Titles
}

func GetUsers() []string {
	var Users []string

	data, err := db.Query("SELECT user_pseudo FROM userIdentity")

	if err != nil {
		fmt.Println(err)
		return []string{}
	}

	for data.Next() {
		var user string
		data.Scan(&user)
		Users = append(Users, user)
	}

	return Users
}

func ChangeImageUser(idUser int, file string) bool {
	query := "UPDATE userProfile SET user_image= ? WHERE user_id= ?"

	_, err := db.Exec(query, file, idUser)

	if err != nil {
		return false
	}

	return true
}

func DeactivateProfil(user *structs.UserIdentity, id int) bool {
	query := "UPDATE userIdentity SET deactivate = ? WHERE user_id= ?"
	db.Exec(query, user.Deactivate, id)

	return true
}

func ReactivateProfil(user structs.UserIdentity, id int) bool {
	query := "UPDATE userIdentity SET deactivate = ? WHERE user_id= ?"
	db.Exec(query, user.Deactivate, id)

	return true
}

func GetPasswordById(id int) string {
	var password string

	data := db.QueryRow("SELECT user_password FROM userIdentity WHERE user_id= ?", id)

	data.Scan(&password)
	return password
}

func UpdatePasswordByUserID(user *structs.Login, id int) bool {

	user.Password, _ = password.HashPassword(user.Password)
	query := "UPDATE userIdentity SET user_password = ? WHERE user_id= ?"
	db.Exec(query, user.Password, id)

	return true
}

func ChangePseudo(user *structs.UserIdentity, id int) bool {
	query1 := "UPDATE allPosts SET user_pseudo = ? WHERE user_id= ?"
	query2 := "UPDATE userIdentity SET user_pseudo = ? WHERE user_id= ?"
	db.Exec(query1, user.Pseudo, id)
	db.Exec(query2, user.Pseudo, id)

	return true
}

func UpdateLocationByUserID(location string, id int) bool {
	query := "UPDATE userProfile SET user_location= ? WHERE user_id= ?"
	db.Exec(query, location, id)
	return true
}

func GetCommentaryPost(postId int) ([]structs.Commentary, bool) {
	var commentaries []structs.Commentary

	rows, error := db.Query("SELECT commentary_id, user_id, post_id, commentary_date, commentary_message  FROM allCommentary WHERE post_id = ?", postId)

	if error != nil {
		return commentaries, true
	}

	for rows.Next() {
		var commentary structs.Commentary
		rows.Scan(&commentary.CommentaryID, &commentary.UserID, &commentary.PostID, &commentary.Date, &commentary.Message)
		commentaries = append(commentaries, commentary)
	}

	return commentaries, false
}

func CreateCommentary(commentary structs.Commentary) (bool, structs.Commentary) {

	insert, error := db.Exec("INSERT INTO allCommentary (user_id, post_id, commentary_date, commentary_message) VALUES (?, ?, ?, ?)", commentary.UserID, commentary.PostID, commentary.Date, commentary.Message)
	if error != nil {
		return false, commentary
	}
	commentary.CommentaryID, _ = insert.LastInsertId()

	return true, commentary
}

func GetPostIdByCategoryId(categories string, post *structs.Post) []string {

	var PostId []string
	//recuperer les postID
	rows, err := db.Query("SELECT post_id FROM postCategory WHERE category_id = ?", categories)
	if err != nil {
		fmt.Println(err)
	}

	for rows.Next() {
		var user string
		rows.Scan(&user)
		PostId = append(PostId, user)
	}
	return PostId
	//return le tableau
}
