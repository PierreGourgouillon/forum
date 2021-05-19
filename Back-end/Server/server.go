package server

import (
	"fmt"
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
		port = "8080"
	}
	fmt.Println(port)
	http.ListenAndServe(":"+port, router)
	fmt.Println("StartServer is Up !")
}

func requestHTTP(router *mux.Router) {

	staticFile(router)
	router.HandleFunc("/", homeRoute)
	router.HandleFunc("/login/", loginRoute)
	router.HandleFunc("/register/", registerRoute)
}

func staticFile(router *mux.Router) {
	fileServer := http.FileServer(http.Dir("./Front-end/"))
	router.
		PathPrefix("/static/").
		Handler(http.StripPrefix("/static/", fileServer))
}

func homeRoute(w http.ResponseWriter, r *http.Request) {

	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/demarrage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func loginRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/connect.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func registerRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/inscription.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}
