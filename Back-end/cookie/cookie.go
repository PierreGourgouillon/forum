package server

import (
	"fmt"
	"github.com/forum/Back-end/password"
	"log"
	"net/http"
)

func SetCookie(w http.ResponseWriter, nameCookie, valueCookie, path string) {

	http.SetCookie(w, &http.Cookie{
		Name:  nameCookie,
		Value: valueCookie,
		Path:  path,
	})

	fmt.Println("Le cookie " + nameCookie + " a été créé !")
}

func readCookie(r *http.Request, nameCookie string) bool {
	_, err := r.Cookie(nameCookie)
	if err != nil {
		fmt.Println("Le cookie " + nameCookie + " n'a pas été trouvé")
		return false
	}
	fmt.Println("Le cookie " + nameCookie + " a été trouvé")

	return true
}

func ValueCookie(r *http.Request, nameCookie string) string {
	cookie, err := r.Cookie(nameCookie)

	if err != nil {
		fmt.Println("Un problème est survenu lors de la récupération de la valeur du cookie")
		return ""
	}

	return cookie.Value
}

func DeleteCookie(r *http.Request, nameCookie string) {
	cookie, err := r.Cookie(nameCookie)
	if err != nil {
		fmt.Println("Le cookie " + nameCookie + " n'a pas pu être supprimé")
		return
	}
	cookie.MaxAge = -1 // supprimer le cookie
	fmt.Println("Le cookie " + nameCookie + " a été supprimé")
}
