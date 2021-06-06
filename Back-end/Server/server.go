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

	//settings Route
	router.HandleFunc("/settings/", settingsRoute)
	router.HandleFunc("/settings/password/", changePasswordRoute)
	router.HandleFunc("/settings/account/", accountInformations)
	router.HandleFunc("/settings/account/pseudo/", accountChangePseudo)
	router.HandleFunc("/settings/account/country/", accountChangeCountry)
	router.HandleFunc("/settings/deactivate/", deactivateAccount)

	//Home Route
	router.HandleFunc("/home/", homeRoute)
	router.HandleFunc("/test/", testRoute)

	router.HandleFunc("/post/", createPost).Methods("POST")
	router.HandleFunc("/post/", getPost).Methods("GET")

	router.HandleFunc("/user/", register).Methods("POST")
}

func staticFile(router *mux.Router) {
	fileServer := http.FileServer(http.Dir("./Front-end/"))
	router.
		PathPrefix("/static/").
		Handler(http.StripPrefix("/static/", fileServer))
}

func route(w http.ResponseWriter, r *http.Request) {

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/homePage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func loginRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/loginPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	userLogin := structs.Login{
		Email:    r.FormValue("email"),
		Password: r.FormValue("password"),
	}

	fmt.Println("login ->")
	fmt.Println(userLogin)

	if userLogin.Email != "" {
		success, message := authentification.CheckUser(userLogin.Email, userLogin.Password)
		if success {
			fmt.Println(message)
			ID := database.GetIdByEmail(userLogin.Email)
			cookie.SetCookie(w, "PioutterID", ID, "/")
			homeRoute(w, r)
			return
		}
		fmt.Println(message)
	}

	tmpl.Execute(w, nil)
}

func registerRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/registerPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func homeRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/pageprofil.html", "./Front-end/Design/Templates/HTML-Templates/header.html")

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

func testRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/test.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func createPost(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var post structs.Post

	unmarshallJSON(r, &post)

	time := time.Now()
	valueCookie, err := strconv.Atoi(cookie.ValueCookie(r, "user-id"))

	if err != nil {
		log.Fatal(err)
	}

	post.IdUser = valueCookie
	post.Date = time.Format("02-01-2006")
	post.Hour = time.Format("15:04:05")

	idPost := database.InsertPost(&post)

	post.PostId = idPost

	fmt.Println("Insertion du post :")
	fmt.Println(post)

	jsonPost, _ := json.Marshal(post)
	w.Write(jsonPost)
}

func getPost(w http.ResponseWriter, r *http.Request) {

}

func register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var user structs.Register
	unmarshallJSON(r, &user)

	fmt.Println(user)

	success := authentification.DoInscription(user)
	if success {
		ID := database.GetIdByEmail(user.Email)
		cookie.SetCookie(w, "PioutterID", ID, "/")
		w.Write([]byte("{\"inscription\":\"true\"}"))
	} else {
		w.Write([]byte("{\"inscription\":\"false\"}"))
	}
}

func unmarshallJSON(r *http.Request, API interface{}) {

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(0)
	}

	json.Unmarshal(body, &API)
}
