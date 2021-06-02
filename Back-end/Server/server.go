package server

import (
	"fmt"
	"html/template"
	"net/http"
	"os"

	"github.com/forum/Back-end/authentification"
	"github.com/forum/Back-end/cookie"
	"github.com/forum/Back-end/database"
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
			homeRoute(w, r)
			return
		} else {
			fmt.Println(message)
		}
	}

	tmpl.Execute(w, nil)
}

func homeRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/pageprofil.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func settingsRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/settingsPage.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func changePasswordRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/password.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountInformations(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/accountInformations.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountChangePseudo(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/changePseudo.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func accountChangeCountry(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/changeCountry.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}

func deactivateAccount(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/Settings/deactivateAccount.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	tmpl.Execute(w, nil)
}
