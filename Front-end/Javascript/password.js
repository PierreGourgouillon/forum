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