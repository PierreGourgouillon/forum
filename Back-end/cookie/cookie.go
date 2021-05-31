package cookie

import (
	"fmt"
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

func ReadCookie(r *http.Request, nameCookie string) bool {
	_, err := r.Cookie(nameCookie)
	if err != nil {
		fmt.Println("Le cookie " + nameCookie + " n'a pas été trouvé")
		return false
	}
	fmt.Println("Le cookie " + nameCookie + " a été trouvé")

	return true
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
