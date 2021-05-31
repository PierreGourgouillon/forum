package authentification

import (
	"fmt"

	"github.com/forum/Back-end/database"
	"github.com/forum/Back-end/password"
	"github.com/forum/Back-end/structs"
)

func DoInscription(data structs.Register) (bool, string) {
	allEmail := database.GetEmailList()

	fmt.Println(allEmail)

	for _, mail := range allEmail {
		if data.Email == mail {
			return false, "Le mail est déja utilisé veuillez en choisir un autre"
		}
	}

	if data.MotDePasse != data.MotDePasseConf {
		return false, "Les deux mot de passe ne correspondent pas"
	}

	database.InsertNewUser(data)

	return true, "Let's Go"
}

func CheckUser(email string, userPassword string) (bool, string) {
	allEmail := database.GetEmailList()

	for _, mail := range allEmail {
		if email == mail {
			passwordHash := database.GetPasswordByEmail(email)
			if password.CheckPasswordHash(userPassword, passwordHash) {
				return true, "Connexion établie sur le compte de l'utilisateur"
			}
			return false, "Le mot de passe saisie n'est pas bon"
		}
	}
	return false, "Aucun compte n'est lié à cette adresse mail"
}
