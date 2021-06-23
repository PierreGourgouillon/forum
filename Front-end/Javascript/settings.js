import * as routeAPI from "./route/route.js"

document.addEventListener("DOMContentLoaded", ()=>{
    let userID = parseInt(getCookie("PioutterID"))
    console.log("hello", userID)
    routeAPI.getUser(userID)
        .then((user)=>{
            document.getElementById("pseudo-user-deactivate").textContent = user.pseudo
            document.getElementById("profile-image-deactivate").src = "data:image/png;base64," + user.image
        })

    document.getElementById("buttonDeactivAcc").addEventListener('click', deactivateAccount)
    document.getElementById("lineDeactivate").addEventListener('click', ()=>{
        document.location.href = `/profil/${userID}`
    })
})

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
