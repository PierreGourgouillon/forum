function ajoutPseudo(){
    let pseudo = document.getElementById("passwordActuel").value
    if (pseudo.length >= 6){
        console.log("pseudo append")
        changePseudo()
    }else{
        console.log(document.getElementById("passwordActuel").value)
        document.getElementById("passwordActuel").value = ""
    }
}

function verificationPseudo(){    
    let pseudo = document.getElementById("passwordActuel").value
    let error = document.getElementById("error")
    if (pseudo.length <= 6){
        error.textContent = "pseudo trop court"
    }else{
        error.textContent = ""
        console.log("verification validé")
    }
}