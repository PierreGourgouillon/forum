package authentification

import (
	"fmt"

	"forum/Back-end/database"
	"forum/Back-end/password"
	"forum/Back-end/structs"
)

func DoInscription(data structs.Register) bool {
	allEmail := database.GetEmailList()

	fmt.Println(allEmail)

	for _, mail := range allEmail {
		if data.Email == mail {
			return false
		}
	}

	database.InsertNewUser(data)

	return true
}

func CheckUser(user structs.Login) (bool, string) {
	allEmail := database.GetEmailList()
	for _, mail := range allEmail {
		if user.Email == mail {
			passwordHash := database.GetPasswordByEmail(user.Email)
			if password.CheckPasswordHash(user.Password, passwordHash) {
				return true, ""
			}
			return false, "password"
		}
	}
	return false, "email"
}
