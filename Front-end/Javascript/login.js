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
            document.cookie = `PioutterID=${res.id}; path=/`
            document.location.href = "/home/"
        } else if(res.login == "password") {
            alert("Le mot de passe n'est pas bon")
        } else if(res.login == "email") {
            alert("Cette adresse mail n'est pas assoscié à un compte")
        }
    })
}

let  flag=true;
function lancement(){
    if(!flag) return;
    flag=false;

    let input = document.getElementById('password');
    input.type = "password"
}

function AfficherMdp(){
    let input = document.getElementById("Motdepasse"); 

    if (input.type === "password"){ 
        input.type = "text"; 
    }else{
        input.type = "password"
    }
} 

function validateEmail() {
    let email = document.getElementById("email").value;
    let boxMail = document.getElementById("boxMail")

    if (checkEmail(email)) {
        boxMail.classList.remove("boxInput")
        boxMail.classList.add("boxInputValid")
      } else {
        boxMail.classList.remove("boxInputValid")
        boxMail.classList.add("boxInput")
      }
}
function checkEmail(email) {
    const check = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return check.test(email);
}

//faire une vérification de du mail+mdp et adapter la classs boxInput ou boxInputValid en fonction