function verifPseudo(){
    let pseudo = document.getElementById("passwordActuel").value
    let error = document.getElementById("error")
    console.log(pseudo)
    if (pseudo.length < 3){
        error.textContent = "pseudo trop court"
    }else{
        changePseudo()
    }


}