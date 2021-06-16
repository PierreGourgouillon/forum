document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logins").addEventListener("click", login)
    document.getElementById("eye").addEventListener("click", AfficherMdp)
})

function login() {
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    let error = document.getElementById("zoneMessErreur")

    if(email.value == "" || password.value == "") {
        error.textContent = "Un des champs est vide"
        return
    }

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
            document.cookie = `PioutterID=${res.id}; path=/`
            document.location.href = "/home/"
        } else if(res.login == "password") {
            error.textContent = "Le mot de passe n'est pas bon"
        } else if(res.login == "email") {
            error.textContent = "Cette adresse mail n'est pas assoscié à un compte"
        }
    })
}

function AfficherMdp(){
    let input = document.getElementById("password"); 

    if (input.type === "password"){ 
        input.type = "text"; 
    }else{
        input.type = "password"
    }
}