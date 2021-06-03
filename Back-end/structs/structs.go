package structs

type Register struct {
	Pseudo         string
	Email          string
	MotDePasse     string
	MotDePasseConf string
	Day            string
	Month          string
	Year           string
}

type Login struct {
	Email    string
	Password string
}
