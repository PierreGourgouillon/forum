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
	"github.com/forum/Back-end/password"
	"github.com/forum/Back-end/structs"
	"github.com/gorilla/mux"
)

func StartServer() {

	fmt.Println("Start Server loading...")
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
	router.HandleFunc("/reactivate/{id}", reactivate).Methods("PUT")

	//settings Route
	router.HandleFunc("/settings/", settingsRoute)
	router.HandleFunc("/settings/password/", changePasswordRoute)
	router.HandleFunc("/settings/account/", accountInformations)
	router.HandleFunc("/settings/account/pseudo/", accountChangePseudo)
	router.HandleFunc("/settings/account/country/", accountChangeCountry)
	router.HandleFunc("/settings/deactivate/", deactivateAccount)

	router.HandleFunc("/profildeactivate/{id}", deactivateRoute).Methods("PUT")
	router.HandleFunc("/profilpassword/{id}", updateProfilPassword).Methods("PUT")
	router.HandleFunc("/profilpseudo/{id}", updateProfilPseudo).Methods("PUT")
	router.HandleFunc("/profillocation/{id}", updateProfilLocation).Methods("PUT")

	//Home Route
	router.HandleFunc("/home/", homeRoute)

	//Filter Route
	router.HandleFunc("/filter/{id}", filterRoute)

	//Profil Route
	router.HandleFunc("/profil/{id}", profilRoute)
	router.HandleFunc("/profilposts/{id}", getPostsUser).Methods("GET")
	router.HandleFunc("/profiluser/{id}", getProfilUser).Methods("GET")
	router.HandleFunc("/profiluser/{id}", updateProfilUser).Methods("PUT")

	//API post
	router.HandleFunc("/post/", createPost).Methods("POST")
	router.HandleFunc("/post/filter/", getPostFilter).Methods("POST")
	router.HandleFunc("/post/trie/", getPostTrie).Methods("POST")
	router.HandleFunc("/post/", getPost).Methods("GET")
	router.HandleFunc("/post/{id}", postShow).Methods("GET")
	router.HandleFunc("/post/{id}", postUpdate).Methods("PUT")
	router.HandleFunc("/post/{id}", postDelete).Methods("DELETE")

	//Reaction Post (like, dislike)
	router.HandleFunc("/reaction/", getReactions).Methods("GET")
	router.HandleFunc("/reaction/", createReaction).Methods("POST")
	router.HandleFunc("/reaction/{id}", getReactionsOnePost).Methods("GET")
	router.HandleFunc("/reaction/{id}", updateReactionOnePost).Methods("PUT")

	//Error Route
	router.HandleFunc("/profilpassword/valid", passwordRouteValid)
	router.HandleFunc("/profilpassword/nonValid", passwordRouteNonValid)

	router.HandleFunc("/profilpseudo/valid", profilPseudoValid)
	router.HandleFunc("/profilpseudo/nonValid", profilPseudoNonValid)

	router.HandleFunc("/profildeactive/valid", profilDeactiveValid)
	router.HandleFunc("/profildeactive/nonValid", profilDeactiveNonValid)

	router.HandleFunc("/profillocation/valid", profilLocationValid)
	router.HandleFunc("/profillocation/nonValid", profilLocationNonValid)

	router.HandleFunc("/introuvable/", profilDeactiveRoute)
	//Commentary Route

	router.HandleFunc("/commentary/{id}", getCommentaryPost).Methods("GET")
	router.HandleFunc("/commentary/", createCommentary).Methods("POST")

	//Footer Route
	router.HandleFunc("/search/", getSearchBar).Methods("GET")

	router.HandleFunc("/test/", testRoute)

	router.HandleFunc("/status/{id}", postPage)

	

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
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/loginPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func registerRoute(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/registerPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func homeRoute(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/home_page.html", "./Front-end/Design/Templates/HTML-Templates/header.html", "./Front-end/Design/Templates/HTML-Templates/footer.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func filterRoute(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/filterPage.html", "./Front-end/Design/Templates/HTML-Templates/header.html", "./Front-end/Design/Templates/HTML-Templates/footer.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func settingsRoute(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	valueCookie, err := strconv.Atoi(cookie.ValueCookie(r, "PioutterID"))

	if valueCookie == 0 {
		http.Redirect(w, r, "/home/", http.StatusSeeOther)
		return
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/settingsPage.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func changePasswordRoute(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/password.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountInformations(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/accountInformations.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountChangePseudo(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/changePseudo.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountChangeCountry(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/changeCountry.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func deactivateAccount(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/deactivateAccount.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilRoute(w http.ResponseWriter, r *http.Request) {
	if !cookie.ReadCookie(r, "PioutterMode") {
		cookie.SetCookie(w, "PioutterMode", "L", "/")
	}

	if !cookie.ReadCookie(r, "PioutterID") {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/profilPage.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	nbrUsers := database.GetNumberOfUsers()
	if err != nil || id > nbrUsers {
		fmt.Println("erreur nb users")
		http.Redirect(w, r, "/error/", http.StatusSeeOther)
	} else if database.IsDeactivate(id) {
		http.Redirect(w, r, "/introuvable/", http.StatusSeeOther)
		return
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

	post.Categories = database.GetCategoriesID(post.Categories)

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
		idUser, _ := strconv.Atoi(ID)
		database.ChangeImageUser(idUser, "iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAABGppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nPgo8cmRmOlJERiB4bWxuczpyZGY9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMnPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6QXR0cmliPSdodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvJz4KICA8QXR0cmliOkFkcz4KICAgPHJkZjpTZXE+CiAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz4KICAgICA8QXR0cmliOkNyZWF0ZWQ+MjAyMS0wNS0xOTwvQXR0cmliOkNyZWF0ZWQ+CiAgICAgPEF0dHJpYjpFeHRJZD4zMWM2ZTcwZC0xZjMzLTRlODktYWYwNi04MmQ3N2I1ZTljMGE8L0F0dHJpYjpFeHRJZD4KICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4KICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgPC9yZGY6bGk+CiAgIDwvcmRmOlNlcT4KICA8L0F0dHJpYjpBZHM+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+YXZhdGFyIG1hbjwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9kYzp0aXRsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3Jp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")
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
		id, _ := strconv.Atoi(ID)
		if !database.IsDeactivate(id) {
			w.Write([]byte("{\"login\":\"login\", \"id\":\"" + ID + "\"}"))
		} else {
			w.Write([]byte("{\"login\":\"deactivate\", \"id\":\"" + ID + "\"}"))
		}
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

	var PageProfil structs.PostsPageProfil

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err)
	}

	PageProfil.PostsUser = database.GetPostsByUserID(id)
	PageProfil.PostsLiked = database.GetPostsLikedByUserID(id)

	jsonPosts, error := json.Marshal(PageProfil)

	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonPosts)
}

func getReactions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	reactions := database.GetAllReactions()

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

	profilUser := database.GetProfilByUserID(id)

	jsonProfil, error := json.Marshal(profilUser)

	if error != nil {
		fmt.Println(error)
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

	if json.Choice == "bio" {
		check := database.UpdateBioByUserID(id, json.Bio)
		if check {
			w.Write([]byte("{\"isUpdate\": \"true\"}"))
		} else {
			w.Write([]byte("{\"isUpdate\": \"false\"}"))
		}
	} else if json.Choice == "image" {
		check := database.ChangeImageUser(id, json.Image)
		if check {
			w.Write([]byte("{\"isUpdate\": \"true\"}"))
		} else {
			w.Write([]byte("{\"isUpdate\": \"false\"}"))
		}
	}
}

func getSearchBar(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var SearchBar structs.SearchBar

	SearchBar.Users = database.GetUsers()
	SearchBar.Titles = database.GetTitles()

	SearchBarJson, error := json.Marshal(SearchBar)

	if error != nil {
		fmt.Println(error)
	}

	w.Write(SearchBarJson)
}

func errorRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/error.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func testRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/pagepost.html", "./Front-end/Design/Templates/HTML-Templates/header.html", "./Front-end/Design/Templates/HTML-Templates/footer.html")

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

func passwordRouteValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionChangePassword/redirectionChangePasswordValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func passwordRouteNonValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionChangePassword/redirectionChangePasswordNonValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilDeactiveValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionDeactiveAccount/redirectionDeactiveAccountValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilDeactiveNonValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionDeactiveAccount/redirectionDeactiveAccountNonValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilPseudoValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionChangePseudo/redirectionChangePseudoValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilPseudoNonValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionChangePseudo/redirectionChangePseudoNonValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilLocationValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionChangeLocation/redirectionChangeLocationValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilLocationNonValid(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionChangeLocation/redirectionChangeLocationNonValid.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func profilDeactiveRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/redirectionDeactiveAccount/redirectionDeactiveAccount.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func updateProfilLocation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var json structs.ProfilUser

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err)
	}

	unmarshallJSON(r, &json)

	isUpdate := database.UpdateLocationByUserID(json.Location, id)
	if isUpdate {
		w.Write([]byte("{\"change\": \"true\"}"))
	} else {
		w.Write([]byte("{\"change\": \"false\"}"))
	}

}

func deactivateRoute(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(0)
	}

	var deactive structs.UserIdentity
	unmarshallJSON(r, &deactive)
	isDelete := database.DeactivateProfil(&deactive, id)

	if isDelete {
		if cookie.ReadCookie(r, "PioutterID") {
			cookie.DeleteCookie(r, "PioutterID")
		}
		w.Write([]byte("{\"delete\": \"true\"}"))

	} else {
		w.Write([]byte("{\"delete\": \"false\"}"))
	}

}

func reactivate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(0)
	}

	var reactivate structs.UserIdentity
	unmarshallJSON(r, &reactivate)

	isReactivate := database.ReactivateProfil(reactivate, id)

	if isReactivate {
		w.Write([]byte("{\"bool\": \"true\"}"))
	} else {
		w.Write([]byte("{\"bool\": \"false\"}"))
	}
}

func updateProfilPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(0)
	}

	var structPassword structs.Login
	unmarshallJSON(r, &structPassword)
	println(&structPassword)

	var passwordHash = database.GetPasswordById(id)

	if password.CheckPasswordHash(structPassword.ActualPassword, passwordHash) {

		isChange := database.UpdatePasswordByUserID(&structPassword, id)
		if isChange {
			w.Write([]byte("{\"change\": \"true\"}"))
		} else {
			w.Write([]byte("{\"change\": \"false\"}"))
		}
	} else {
		w.Write([]byte("{\"change\": \"false\"}"))
	}
}

func updateProfilPseudo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(0)
	}

	var pseudoStruct structs.UserIdentity
	unmarshallJSON(r, &pseudoStruct)
	isValid := database.ChangePseudo(&pseudoStruct, id)

	if isValid {
		w.Write([]byte("{\"valid\": \"true\"}"))
		println("cest ok")

	} else {
		w.Write([]byte("{\"valid\": \"false\"}"))
	}

}

func getCommentaryPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Println(err)
	}

	commentaries, error := database.GetCommentaryPost(id)

	if !error {
		jsonCommentary, _ := json.Marshal(commentaries)
		w.Write(jsonCommentary)
	} else {
		w.Write([]byte("{\"error\": \"true\"}"))
	}
}

func createCommentary(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	var commentary structs.Commentary

	unmarshallJSON(r, &commentary)

	time := time.Now()
	commentary.Date = time.Format("02-01-2006")

	isInsert, newCommentary := database.CreateCommentary(commentary)

	if isInsert {
		commentaryJSON, _ := json.Marshal(newCommentary)
		w.Write(commentaryJSON)
	} else {
		w.Write([]byte("{\"create\": \"false\"}"))
	}
}

func postPage(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/pagepost.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func getPostFilter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var post structs.Post
	unmarshallJSON(r, &post)
	println("categorieID: ", post.Categories[0])

	//recuperation idposts associer a idCategories selectionné
	idPostsArray := database.GetPostIdByCategoryId(post.Categories[0], &post)

	var idPostsArrayInt = []int{}
	var n = 0

	for _, i := range idPostsArray {
		j, err := strconv.Atoi(i)
		if err != nil {
			panic(err)
		}
		idPostsArrayInt = append(idPostsArrayInt, j)
		println(idPostsArrayInt[n])
		n++
	}

	//recuperer les posts des idposts de idPostsArray
	postsArray := database.GetPostWithArray(idPostsArrayInt)
	jsonPostFilterCategories, error := json.Marshal(postsArray)
	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonPostFilterCategories)
}


func getPostTrie(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var requestSql structs.RequestSql
	unmarshallJSON(r, &requestSql)
	allPostTrie := database.GetAllPostsTrie(requestSql.RequestSql)
	println("requestSql: ", requestSql.RequestSql)
	jsonPostTrie, error := json.Marshal(allPostTrie)
	if error != nil {
		log.Fatal(error)
	}

	w.Write(jsonPostTrie)
}
