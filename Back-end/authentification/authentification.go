package authentification

import (
	"github.com/forum/Back-end/database"
	"github.com/forum/Back-end/structs"
)

func DoInscription(data structs.Register) (bool, string) {
	// allEmail := database.GetEmailList()

	// for _, mail := range allEmail {
	// 	if data.Email == mail {
	// 		return false, "Le mail est déja utilisé veuillez en choisir un autre"
	// 	}
	// }

	if data.MotDePasse != data.MotDePasseConf {
		return false, "Les deux mot de passe ne correspondent pas"
	}

	database.InsertNewUser(data)

	return true, "Let's Go"
}
