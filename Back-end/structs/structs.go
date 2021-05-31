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

type UserIdentity struct {
	ID         int
	Pseudo     string
	Email      string
	Location   string
	Image      string
	Biographie string
	Birth      string
}

type Post struct {
	IdUser     int
	Pseudo     string
	Message    string
	Categories []string
	Date       string
	Hour       string
	Like       int
	Dislike    int
}
