document.addEventListener("DOMContentLoaded", getPostsUser)

function getPostsUser() {
    const id = valueOfCookie("PioutterID")
    console.log("salut")

    fetch(`/profil/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((reponse)=>{
        return reponse.json()
    })
    .then((res)=>{
        console.log(res)
        addAllPost(res, true)
    })
    .catch((error)=>{
        alert(error.message)
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

function addAllPost(response, isNotSolo){
    if(isNotSolo){
        response.forEach((post)=>{
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

            link.forEach((element)=>{
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
    }else{
        let template = document.getElementById("postTemplate")
        let clone = document.importNode(template.content, true)
        let container = document.getElementById("containerPost")

        let imageProfil = clone.getElementById("image-user")
        let pseudo = clone.getElementById("pseudo-user")
        let title = clone.getElementById("title-user")
        let messagePost = clone.getElementById("message-post")
        let like = clone.getElementById("like-post")
        let dislike = clone.getElementById("dislike-post")
        let containerLike = clone.getElementById("container-like-post")
        let link = [...clone.querySelectorAll(".postLinkos")]

        link.forEach((element)=>{
            element.href = `/status/${response.PostId}`
        })

        pseudo.textContent = response.pseudo
        title.textContent = response.title
        messagePost.textContent += response.message
        like.textContent = response.like
        dislike.textContent = response.dislike

        dislike.setAttribute("post_id", response.PostId)
        like.setAttribute("post_id", response.PostId)

        container.append(clone)
    }
}