package server

import (
	"fmt"
	"html/template"
	"net/http"
	"os"

	"github.com/forum/Back-end/authentification"
	"github.com/forum/Back-end/structs"
	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"
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

	userRegister := structs.Register{
		Pseudo:         r.FormValue("username"),
		Email:          r.FormValue("email"),
		MotDePasse:     r.FormValue("password"),
		MotDePasseConf: r.FormValue("confirmationpassword"),
		Day:            r.FormValue("aniversaire_jour"),
		Month:          r.FormValue("anniversaire_mois"),
		Year:           r.FormValue("anniversaire_ans"),
	}

	fmt.Println(userRegister)

	if userRegister.Pseudo != "" {
		success, message := authentification.DoInscription(userRegister)
		fmt.Println(success)
		if success {
			fmt.Println("Un nouvel utilisateur s'est inscrit")
			tmpl2, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Authentification/homePage.html")
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			tmpl2.Execute(w, nil)
			return
		} else {
			fmt.Println(message)
		}
	}

	tmpl.Execute(w, nil)
}
