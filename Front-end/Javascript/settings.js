function delCookie(){
    document.cookie = "PioutterID=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("cookie delete")
    document.location.href="/"
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

document.addEventListener("DOMContentLoaded", () => {
    getProfilUser()
})

function getProfilUser() {
    const id = parseInt(getCookie("PioutterID"))

    fetch(`/profiluser/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((reponse) =>  {
        return reponse.json()
    })
    .then((res) => {
        profilUser(res)
    })
    .catch((err) => {
        console.log("Profil non trouvé")
    })
}

function profilUser(profil) {
    console.log(profil)

    let email = document.getElementById("emailid")
    let pseudo = document.getElementById("pseudoid")
    let country = document.getElementById("locationid")
    let bio = document.getElementById("bioid")
    let birth = document.getElementById("paulo")

    birth.textContent = profil.birth
    email.textContent = profil.email
    pseudo.textContent = profil.pseudo
    country.textContent = profil.location
    bio.textContent = profil.bio
}


function verifConnect(){
    const id = parseInt(getCookie("PioutterID"))
    let infoCompte= document.getElementById("infoCompte")
    let changeMdp = document.getElementById("changeMdp")
    let deaCompte = document.getElementById("deaCompte")
    let deconnexion = document.getElementById("kkk")

    if (id > 0){
        document.getElementById("MyElement").className = "MyClass";
        document.getElementById("MyElement").className = "MyClass";
        document.getElementById("MyElement").className = "MyClass";
    }else {
        document.getElementById("MyElement").className = "MyClass";
        document.getElementById("MyElement").className = "MyClass";
        document.getElementById("MyElement").className = "MyClass";
  
    }
}

function verifConnectInfoAccount(){
    const id = parseInt(getCookie("PioutterID"))
    // let infoCompte= document.getElementById("infoCompte")
    if (id > 0){
        document.location.href="/settings/account/"
    }

}

function verifConnectChangMdp(){
    const id = parseInt(getCookie("PioutterID"))
    // let infoCompte= document.getElementById("infoCompte")
    if (id > 0){
        document.location.href="/settings/password/"
    }

}

function verifConnectDeaAccount(){
    const id = parseInt(getCookie("PioutterID"))
    // let infoCompte= document.getElementById("infoCompte")
    if (id > 0){
        document.location.href="/settings/deactivate/"
    }

}
