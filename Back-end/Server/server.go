package server

import (
	"encoding/json"
	"fmt"
	"github.com/forum/Back-end/authentification"
	"github.com/forum/Back-end/database"
	"github.com/forum/Back-end/structs"
	"github.com/gorilla/mux"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"time"
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
	router.HandleFunc("/", homeRoute)
	router.HandleFunc("/login/", loginRoute)
	router.HandleFunc("/register/", registerRoute)
	router.HandleFunc("/home/", newsRoute)
	router.HandleFunc("/settings/", settingsRoute)
	router.HandleFunc("/test/", testRoute)

	router.HandleFunc("/post/", createPost).Methods("POST")
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

	cookieIsSet := ReadCookie(r, "user-id")

	if !cookieIsSet {
		SetCookie(w, "user-id", "15", "/")
	}

	fmt.Println(ValueCookie(r, "user-id"))

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

func testRoute(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("./Front-end/Design/HTML-Pages/test.html")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	//valueCookie := ValueCookie(r,"user-id")
	/*user := database.GetIdentityUser("1")
	time := time.Now()

	userPost := structs.Post{
		IdUser:  user.ID,
		Pseudo:  user.Pseudo,
		Message: r.FormValue("message"),
		Date:    time.Format("02-01-2006"),
		Hour:    time.Format("15:04:05"),
	}

	fmt.Println("Post : ")
	fmt.Println(userPost)

	database.InsertPost(&userPost)

	allPosts := database.GetAllPosts()

	fmt.Println(allPosts)*/

	tmpl.Execute(w, nil)
}

func createPost(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-type", "application/json;charset=UTF-8")
	w.WriteHeader(http.StatusOK)

	var post structs.Post

	unmarshallJSON(r, &post)

	time := time.Now()
	post.Date = time.Format("02-01-2006")
	post.Hour = time.Format("15:04:05")

	fmt.Println(post)

	database.InsertPost(&post)

	json.NewEncoder(w).Encode(post)
}

func unmarshallJSON(r *http.Request, API interface{}) {

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Println(err.Error())
		os.Exit(0)
	}
	json.Unmarshal(body, &API)
}
