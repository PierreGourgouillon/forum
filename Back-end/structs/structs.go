package structs

type Register struct {
	Pseudo     string `json:"pseudo"`
	Email      string `json:"email"`
	MotDePasse string `json:"password"`
	Birth      string `json:"birth"`
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
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
	Title      string   `json:"title"`
	Pseudo     string   `json:"pseudo"`
	Message    string   `json:"message"`
	Categories []string `json:"categories"`
	Date       string
	Hour       string
	Like       int `json:"like"`
	Dislike    int `json:"dislike"`
}

type Reaction struct {
	PostId  int  `json:"idPost"`
	IdUser  int  `json:"idUser"`
	Like    bool `json:"like"`
	Dislike bool `json:"dislike"`
}
