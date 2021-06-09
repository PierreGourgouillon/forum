document.addEventListener("DOMContentLoaded", getPostsUser)

function getPostsUser() {
    var urlcourante = document.location.href
    let start = urlcourante.indexOf("/profil/") + 8
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
        console.log(res)
        addAllPost(res)
    })
    .catch((error) => {
        console.log("O post")
    })
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
        console.log(clone)
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