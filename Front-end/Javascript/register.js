function register() {
    const pseudo = document.getElementById("pseudo")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const passwordConf = document.getElementById("passwordConf")
    const day = document.getElementById("day")
    const month = document.getElementById("month")
    const year = document.getElementById("year")

    if(pseudo.value == "" || email.value == "" || password.value == "" || passwordConf.value == "" || day.value == "" || month.value == "" || year.value == "") {
        alert("Un des champs est vide")
        return
    }

    if(password.lenght < 8) {
        alert("Le mot de passe est trop court")
        return
    }

    if(password.value != passwordConf.value) {
        alert("Les mots de passes ne sont pas identiques")
        return
    }

    fetch("/user/", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            pseudo: pseudo.value,
            email: email.value,
            password: password.value,
            passwordConf: passwordConf.value,
            birth: `${day.value}/${month.value}/${year.value}`
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((res) => {
        if(res.register == "true") {
            document.location.href = "/home/"
        } else {
            alert("L'email est déjà utilisé")
        }
    })

}

function login() {
    const email = document.getElementById("email")
    const password = document.getElementById("password")

    if(email.value == "" || password.value == "") {
        alert("Un des champs est vide")
        return
    }

    console.log("alu")
    fetch("/users/", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((res) => {
        if(res.login == "login") {
            // document.cookie = `PioutterID=${res.id}, path=/`
            document.location.href = "/home/"
        } else if(res.login == "password") {
            alert("Le mot de passe n'est pas bon")
        } else if(res.login == "email") {
            alert("Cette adresse mail n'est pas assoscié à un compte")
        }
    })
}
