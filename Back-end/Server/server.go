package server

import (
	"fmt"
	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"
	"html/template"
	"net/http"
	"os"
)

func StartServer() {

	fmt.Println("StartServer loading...")
	router := mux.NewRouter()

	requestHTTP(router)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8088"
	}
	fmt.Println(port)
	http.ListenAndServe(":"+port, csrf.Protect([]byte("32-byte-long-auth-key"))(router))
}

func requestHTTP(router *mux.Router) {

	staticFile(router)
	router.HandleFunc("/", homeRoute)
	router.HandleFunc("/login/", loginRoute)
	router.HandleFunc("/register/", registerRoute)
	router.HandleFunc("/home/", newsRoute)
	router.HandleFunc("/settings/", settingsRoute)
}

func staticFile(router *mux.Router) {
	fileServer := http.FileServer(http.Dir("./Front-end/"))
	router.
		PathPrefix("/static/").
		Handler(http.StripPrefix("/static/", fileServer))
}

func homeRoute(w http.ResponseWriter, r *http.Request) {

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

func newsRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/pageprofil.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func settingsRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/settingsPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}
