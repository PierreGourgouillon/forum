document.addEventListener("DOMContentLoaded", getPostsUser)
document.addEventListener("DOMContentLoaded", getProfilUser)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('image-close').addEventListener('click', () => {
        let divPopUp = document.getElementById("popUp-update")
        divPopUp.style.display = "none"
    })
    const isDelete = deleteGear()
    if(!isDelete) {
        document.getElementById("gear").addEventListener("click", inputBio)
        document.getElementById("send").addEventListener("click", updateBio)
    }
})

function getPostsUser() {
    var urlcourante = document.location.href
    let start = urlcourante.indexOf("/profil/") + 8
    const id = urlcourante.substring(start)

    fetch(`/profilposts/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((reponse) =>  {
        return reponse.json()
    })
    .then(async (res) => {
        await addAllPost(res)
    })
    .catch((error) => {
        console.log("O post")
    })
}

function getProfilUser() {
    const urlcourante = document.location.href
    const start = urlcourante.indexOf("/profil/") + 8
    const id = urlcourante.substring(start)

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
    .catch((error) => {
        console.log("Profil non trouvé")
    })
}

function profilUser(profil) {
    let pseudo = document.getElementById("pseudoid")
    let country = document.getElementById("countryid")
    let bio = document.getElementById("bioid")

    pseudo.textContent = profil.pseudo
    country.textContent = profil.location
    bio.textContent = profil.bio
}

function inputBio() {
    let div = document.getElementById("popUp-update")
    if(div.style.display == "none") {
        div.style.display = "block"
    } else {
        div.style.display = "none"
    }
}

function updateBio() {
    const urlcourante = document.location.href
    const start = urlcourante.indexOf("/profil/") + 8
    const id = urlcourante.substring(start)

    const bio = document.getElementById("bioid")
    const newBio = document.getElementById("newBio")

    if(newBio.value  == "") {
        return
    }

    fetch(`/profiluser/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            choice : "bio",
            bio : newBio.value,
        })
    })
    .then((reponse) =>  {
        return reponse.json()
    })
    .then((res) => {
        if(res.isUpdate == "true") {
            bio.textContent = newBio.value
            document.getElementById("popUp-update").style.display = "none"

        }
    })
    .catch((error) => {
        console.log("O post")
    })
}

function deleteGear() {
    const urlcourante = document.location.href
    const start = urlcourante.indexOf("/profil/") + 8
    const id = urlcourante.substring(start)
    const cookieID = valueOfCookie("PioutterID")

    if(id != cookieID) {
        document.getElementById("gear").style.display = "none"
        return true
    }

    return false
}

function valueOfCookie(cookie) {
    console.log(document.cookie)
    let start = document.cookie.indexOf(`${cookie}=`) + cookie.length + 1
    let end = document.cookie.indexOf(";", document.cookie.indexOf(`${cookie}=`))
    let value
    if(end < start) {
        value = document.cookie.substring(start)
    } else {
        value = document.cookie.substring(start, end)
    }  
    console.log(value)
    return value
}