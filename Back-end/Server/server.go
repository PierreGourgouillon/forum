package server

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/forum/Back-end/authentification"
	"github.com/forum/Back-end/cookie"
	"github.com/forum/Back-end/database"
	"github.com/forum/Back-end/structs"
	"github.com/gorilla/mux"
)

func StartServer() {

	fmt.Println("StartServer loading...")
	router := mux.NewRouter().StrictSlash(true)

	requestHTTP(router)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8088"
	}
	fmt.Println(port)
	http.ListenAndServe(":"+port, router)
}

func requestHTTP(router *mux.Router) {
	staticFile(router)

	//Authentification Route
	router.HandleFunc("/", route)
	router.HandleFunc("/login/", loginRoute)
	router.HandleFunc("/register/", registerRoute)

	//API Authentification
	router.HandleFunc("/user/", register).Methods("POST")
	router.HandleFunc("/user/{id}", getUsers).Methods("GET")

	router.HandleFunc("/users/", login).Methods("POST")

	//settings Route
	router.HandleFunc("/settings/", settingsRoute)
	router.HandleFunc("/settings/password/", changePasswordRoute)
	router.HandleFunc("/settings/account/", accountInformations)
	router.HandleFunc("/settings/account/pseudo/", accountChangePseudo)
	router.HandleFunc("/settings/account/country/", accountChangeCountry)
	router.HandleFunc("/settings/deactivate/", deactivateAccount)

	//Home Route
	router.HandleFunc("/home/", homeRoute)

	//Profil Route
	router.HandleFunc("/profil/{id}", profilRoute)
	router.HandleFunc("/profilposts/{id}", getPostsUser).Methods("GET")
	router.HandleFunc("/profiluser/{id}", getProfilUser).Methods("GET")
	router.HandleFunc("/profiluser/{id}", updateProfilUser).Methods("PUT")

	//API post
	router.HandleFunc("/post/", createPost).Methods("POST")
	router.HandleFunc("/post/", getPost).Methods("GET")
	router.HandleFunc("/post/{id}", postShow).Methods("GET")
	router.HandleFunc("/post/{id}", postUpdate).Methods("PUT")
	router.HandleFunc("/post/{id}", postDelete).Methods("DELETE")

	//Reaction Post (like, dislike)
	router.HandleFunc("/reaction/", getReactions).Methods("GET")
	router.HandleFunc("/reaction/", createReaction).Methods("POST")
	router.HandleFunc("/reaction/{id}", getReactionsOnePost).Methods("GET")
	router.HandleFunc("/reaction/{id}", updateReactionOnePost).Methods("PUT")

	//Page error
	router.HandleFunc("/error/", errorRoute)
}

func staticFile(router *mux.Router) {
	fileServer := http.FileServer(http.Dir("./Front-end/"))
	router.
		PathPrefix("/static/").
		Handler(http.StripPrefix("/static/", fileServer))
}

func route(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/homePage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func loginRoute(w http.ResponseWriter, r *http.Request) {
	// if cookie.ReadCookie(r, "PioutterID") {
	// 	http.Redirect(w, r, "/home/", http.StatusSeeOther)
	// 	return
	// }

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/loginPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func registerRoute(w http.ResponseWriter, r *http.Request) {
	if cookie.ReadCookie(r, "PioutterID") {
		cookie.DeleteCookie(r, "PioutterID")
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/registerPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func homeRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/home_page.html", "./Front-end/Design/Templates/HTML-Templates/header.html", "./Front-end/Design/Templates/HTML-Templates/footer.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func settingsRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/settingsPage.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func changePasswordRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/password.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountInformations(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/accountInformations.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountChangePseudo(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/changePseudo.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountChangeCountry(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/changeCountry.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func deactivateAccount(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/deactivateAccount.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/profilPage.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	nbrUsers := database.GetNumberOfUsers()
	if id > nbrUsers || err != nil {
		http.Redirect(w, r, "/", http.StatusSeeOther)
	}

	tmpl.Execute(w, nil)
}

func createPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var post structs.Post
	unmarshallJSON(r, &post)

	time := time.Now()
	valueCookie, err := strconv.Atoi(cookie.ValueCookie(r, "PioutterID"))

	if err != nil {
		log.Fatal(err)
	}

	post.IdUser = valueCookie
	post.Date = time.Format("02-01-2006")
	post.Hour = time.Format("15:04:05")

	idPost := database.InsertPost(&post)

	post.PostId = int(idPost)

	fmt.Println("Insertion du post :")
	fmt.Println(post)

	jsonPost, _ := json.Marshal(post)
	w.Write(jsonPost)
}

func getPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	postArray := database.GetAllPosts()
	jsonAllPost, error := json.Marshal(postArray)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonAllPost)
}

func register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var user structs.Register
	unmarshallJSON(r, &user)

	success := authentification.DoInscription(user)
	if success {
		ID := database.GetIdByEmail(user.Email)
		w.Write([]byte("{\"register\":\"true\", \"id\":\"" + ID + "\"}"))
	} else {
		w.Write([]byte("{\"register\":\"false\"}"))
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var user structs.Login
	unmarshallJSON(r, &user)

	success, message := authentification.CheckUser(user)
	if success {
		ID := database.GetIdByEmail(user.Email)
		w.Write([]byte("{\"login\":\"login\", \"id\":\"" + ID + "\"}"))
	} else {
		if message == "password" {
			w.Write([]byte("{\"login\":\"password\"}"))
		} else {
			w.Write([]byte("{\"login\":\"email\"}"))
		}
	}
}

func postShow(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		log.Fatal(err)
	}

	post := database.FindPostById(id)

	jsonPost, error := json.Marshal(post)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonPost)
}

func postUpdate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		log.Fatal(err)
	}

	var post structs.Post
	unmarshallJSON(r, &post)

	isUpdate := database.UpdatePost(id, &post)

	if isUpdate {
		w.Write([]byte("{\"update\":\"true\"}"))
	} else {
		w.Write([]byte("{\"update\":\"false\"}"))
	}
}

func postDelete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		log.Fatal(err)
	}

	isDelete := database.DeletePost(id)

	if isDelete {
		w.Write([]byte("{\"delete\": \"true\"}"))
	} else {
		w.Write([]byte("{\"delete\": \"false\"}"))
	}
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		log.Fatal(err)
	}

	idString := strconv.Itoa(id)

	user := database.GetIdentityUser(idString)

	jsonAllPost, error := json.Marshal(user)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonAllPost)

}

func getPostsUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err)
	}

	postsUser := database.GetPostsByUserID(id)

	jsonPosts, error := json.Marshal(postsUser)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonPosts)
}

func getReactions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	reactions := database.GetAllReactions()

	fmt.Println(reactions)

	jsonReactions, err := json.Marshal(reactions)

	if err != nil {
		log.Fatal(err)
	}

	w.Write(jsonReactions)
}

func createReaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var reaction structs.Reaction

	unmarshallJSON(r, &reaction)

	isInsert := database.CreateReaction(reaction)

	isInsertJson, error := json.Marshal(isInsert)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(isInsertJson)
}

func getReactionsOnePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		log.Fatal(err)
	}

	reaction := database.GetReactionsOnePost(id)

	reactionsPost, error := json.Marshal(reaction)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(reactionsPost)
}

func updateReactionOnePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var reactionPost structs.Reaction

	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		log.Fatal(err)
	}

	unmarshallJSON(r, &reactionPost)

	isUpdate := database.UpdateReactionOnePost(id, reactionPost)

	if isUpdate {
		w.Write([]byte("{\"isUpdate\": \"true\"}"))
	} else {
		w.Write([]byte("{\"isUpdate\": \"false\"}"))
	}

}

func getProfilUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("id")
	fmt.Println(id)

	profilUser := database.GetProfilByUserID(id)

	jsonProfil, error := json.Marshal(profilUser)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonProfil)
}

func updateProfilUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var json structs.ProfilUser

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err)
	}

	unmarshallJSON(r, &json)

	fmt.Println(json.Choice)

	if json.Choice == "bio" {
		check := database.UpdateBioByUserID(id, json.Bio)
		if check {
			w.Write([]byte("{\"isUpdate\": \"true\"}"))
		} else {
			w.Write([]byte("{\"isUpdate\": \"false\"}"))
		}
	}
}

func errorRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/test.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func unmarshallJSON(r *http.Request, API interface{}) {
	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(0)
	}

	json.Unmarshal(body, &API)
}
