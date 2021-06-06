
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
            'content-type': 'application/jsoñ'
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
        console.log(response.json)
        return response.json()
    })
    .then((res) => {
        console.log(res)
        if(res.inscription == "true") {
            document.location.href = "/home/"
        } else {
            alert("L'email est déjà utilisé")
        }
    })

}
