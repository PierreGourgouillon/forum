document.addEventListener("DOMContentLoaded", getPostsUser)
document.addEventListener("DOMContentLoaded", getProfilUser)
document.addEventListener("DOMContentLoaded", () => {
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
    .then((res) => {
        console.log(res)
        addAllPost(res)
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
        console.log("O post")
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
    let div = document.getElementById("setBio")
    let gear = document.getElementById("gear")
    if(div.style.display == "none") {
        div.style.display = ""
        gear.classList.remove("gear")
        gear.classList.add("close")
    } else {
        div.style.display = "none"
        gear.classList.remove("close")
        gear.classList.add("gear")
    }
}

function updateBio() {
    const urlcourante = document.location.href
    const start = urlcourante.indexOf("/profil/") + 8
    const id = urlcourante.substring(start)

    const bio = document.getElementById("bioid")
    const newBio = document.getElementById("newBio")

    if(newBio.value  == "") {
        console.log("nop")
        return
    }

    const div = document.getElementById("setBio")
    const gear = document.getElementById("gear")

    console.log("new bio ", newBio.value)
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
        console.log(res)
        if(res.isUpdate == "true") {
            bio.textContent = newBio.value
            div.style.display = "none"
            gear.classList.remove("close")
            gear.classList.add("gear")
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

function addAllPost(response) {
    response.forEach((post) => {
        let template = document.getElementById("postTemplate")
        let clone = document.importNode(template.content, true)
        let container = document.getElementById("containerPost")

        let imageProfil = clone.getElementById("image-user")
        let pseudo = clone.getElementById("pseudo-user")
        let title = clone.getElementById("title-user")
        let messagePost = clone.getElementById("message-post")
        let like = clone.getElementById("like-post")
        let dislike = clone.getElementById("dislike-post")
        let link = [...clone.querySelectorAll(".postLinkos")]

        link.forEach((element) => {
            element.href = `/status/${post.PostId}`
        })

        pseudo.textContent = post.pseudo
        title.textContent = post.title
        messagePost.textContent += post.message
        like.textContent = post.like
        dislike.textContent = post.dislike

        like.setAttribute("post_id", post.PostId)
        dislike.setAttribute("post_id", post.PostId)

        container.append(clone)
    })
}