function testGeneral(){

    const newPassword = document.getElementById("newPassword")
    const renewPassword = document.getElementById("renewPassword")
    const error = document.getElementById("zoneMessErreur")

    if(passwordActuel.value == "" || newPassword.value == "" || renewPassword.value == "") {
        console.log("un des champs est vide")
        error.textContent = "Un des champs est vide"
        return false
    }

    if(newPassword.value.length <= 10){
        console.log("le mot de passe est trop court")
        error.textContent = "le mot de passe est trop court"
        return false
    }

    if(newPassword.value != renewPassword.value) {
        console.log('les mots de passes ne sont pas identiques')
        return false
    }
    console.log("les tests on ete reussie")
    return true
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("eye1").addEventListener("click", AfficherMdp1)
    document.getElementById("eye2").addEventListener("click", AfficherMdp2)
    document.getElementById("eye3").addEventListener("click", AfficherMdp3)
})

function AfficherMdp1() {
    let input = document.getElementById('passwordActuel');

    if(input.type === "password") {
        input.type = "text"; 
    } else {
        input.type = "password"
    }
} 

function AfficherMdp2() {
    let input = document.getElementById('newPassword');
    
    if(input.type === "password") { 
        input.type = "text"; 
    } else {
        input.type = "password"
    }
} 

function AfficherMdp3() {
    let input = document.getElementById('renewPassword');
    
    if(input.type === "password") { 
        input.type = "text"; 
    } else {
        input.type = "password"
    }
} 
