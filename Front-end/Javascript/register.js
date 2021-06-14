document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("register").addEventListener("click", register)
    document.getElementById("eye1").addEventListener("click", AfficherMdp1)
    document.getElementById("eye2").addEventListener("click", AfficherMdp2)
    document.getElementById("btRandom").addEventListener("click", strRandom)
    document.getElementById("passwordConf").addEventListener("keyup", validatePassword)
})

function register() {
    const pseudo = document.getElementById("pseudo")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const passwordConf = document.getElementById("passwordConf")
    const birth = document.getElementById("birth")
    let error = document.getElementById("zoneMessErreur")
    
    let tab = birth.value.split("-")
    const birthChange = `${tab[2]}/${tab[1]}/${tab[0]}`

    if(pseudo.value == "" || email.value == "" || password.value == "" || passwordConf.value == "" || birthChange == "undefined/undefined/") {
        error.textContent = "Un des champs est vide"
        return
    }

    if(password.lenght < 12) {
        error.textContent = "Le mot de passe est trop court"
        return
    }

    if(password.value != passwordConf.value) {
        error.textContent = "Les mots de passes ne sont pas identiques"
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
            birth: birthChange
        })
    })
    .then((response) => {
        return response.json()
    })
    .then((res) => {
        if(res.register == "true") {
            document.cookie = `PioutterID=${res.id}; path=/`
            document.location.href = "/home/"
        } else {
            error.textContent = "L'email est déjà utilisé"
        }
    })
}

function AfficherMdp1() {
    let input = document.getElementById('password');
    
    if(input.type === "password") { 
        input.type = "text"; 
    } else {
        input.type = "password"
    }
} 

function AfficherMdp2() {
    let input = document.getElementById('passwordConf');
    
    if(input.type === "password") { 
        input.type = "text"; 
    } else {
        input.type = "password"
    }
} 

function strRandom() {
    let sortie1 = document.getElementById("password")
    let sortie2 = document.getElementById("passwordConf")
    const b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY1234567890-*_&@!?()/'
    let mdp = ''

    for (let i=0; i < 15; i++) {
      mdp += b[Math.floor(Math.random() * b.length)];
    }
    sortie1.value = mdp
    sortie2.value = mdp
}

function validatePassword() {
    let password = document.getElementById("password")
    let passwordConf = document.getElementById("passwordConf");

  if(passwordConf.value != password.value) {
    passwordConf.setCustomValidity("Passwords Don't Match");
    passwordConf.style.color = 'red';
  } else {
    passwordConf.setCustomValidity('');
    passwordConf.style.color = 'green';
  }
}