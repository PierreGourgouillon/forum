package server

import (
	"fmt"
	"github.com/forum/Back-end/password"
	"log"
	"net/http"
)

func setCookie(w http.ResponseWriter, nameCookie, valueCookie, path string) {
	passwordHash, err := password.HashPassword(valueCookie)

	if err != nil {
		log.Fatal(err)
	}

	http.SetCookie(w, &http.Cookie{
		Name:  nameCookie,
		Value: passwordHash,
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

func deleteCookie(r *http.Request, nameCookie string) {
	cookie, err := r.Cookie(nameCookie)
	if err != nil {
		fmt.Println("Le cookie " + nameCookie + " n'a pas pu être supprimé")
		return
	}
	cookie.MaxAge = -1 // supprimer le cookie
	fmt.Println("Le cookie " + nameCookie + " a été supprimé")
}
