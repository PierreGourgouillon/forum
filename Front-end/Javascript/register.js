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
            document.cookie = `PioutterID=${res.id}; path=/`
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
            document.cookie = `PioutterID=${res.id}; path=/`
            document.location.href = "/home/"
        } else if(res.login == "password") {
            alert("Le mot de passe n'est pas bon")
        } else if(res.login == "email") {
            alert("Cette adresse mail n'est pas assoscié à un compte")
        }
    })
}

function AfficherMdp(){
    let input1 = document.getElementById("Motdepasse"); 
    let input2 = document.getElementById("confirmationMotdepasse"); 

    if (input1.type === "password"){ 
        input1.type = "text"; 
    }else{
        input1.type = "password"
    }

    if (input2.type === "password"){ 
        input2.type = "text"; 
    }else{
        input2.type = "password"
    }
} 

//peut etre faire autrement qu'en js car visible sur inspecter l'element
function strRandom() {
    let sortie1 = document.getElementById("Motdepasse")
    let sortie2 = document.getElementById("confirmationMotdepasse")
    const b = 'abcdefghijklmnopqrstuvwxyz1234567890-*_'
    let mdp = ''

    for (let i=0; i < 10; i++) {
      mdp += b[Math.floor(Math.random() * b.length)];
    }
    sortie1.value = mdp
    sortie2.value = mdp
}

function validatePassword(){
    let password = document.getElementById("Motdepasse")
    let confirm_password = document.getElementById("confirmationMotdepasse");

  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
    document.getElementById('Motdepasse').style.color = 'red';
    document.getElementById('confirmationMotdepasse').style.color = 'red';
    console.log("test")
  } else {
    confirm_password.setCustomValidity('');
    document.getElementById('confirmationMotdepasse').style.color = 'black';
    document.getElementById('Motdepasse').style.color = 'black';
  }
}


/*permet de faire de la place pour mettre le message d'erreur*/
function deplacerBt(){
  messErreur= getElementById('messageErreur')
  bt = getElementById('bt')
  if(messErreur.value != ""){
    bt.style.marginTop = '40px'
  } 
}