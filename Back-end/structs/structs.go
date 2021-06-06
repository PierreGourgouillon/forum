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
	PostId     int
	IdUser     int
	Pseudo     string   `json:"pseudo"`
	Message    string   `json:"message"`
	Categories []string `json:"categories"`
	Date       string
	Hour       string
	Like       int `json:"like"`
	Dislike    int `json:"dislike"`
}
