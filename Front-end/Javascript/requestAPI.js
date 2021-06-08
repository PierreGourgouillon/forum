
document.addEventListener("DOMContentLoaded",postIndex)
document.getElementById("create-post").addEventListener("click", createPost)
document.getElementById("container-post-like").addEventListener("click", addReactions(event, true))
document.getElementById("container-post-dislike").addEventListener("click", addReactions(event, false))



async function createPost(){
    let title = document.getElementById("insert-title")
    let message = document.getElementById("insert-message")

    let valueCookie = getCookie("PioutterID")

    let user = await getUser(valueCookie)


    fetch("/post/", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            title: title.value,
            pseudo: user.Pseudo,
            message: message.value,
            like: 0,
            dislike: 0
        })
    })
        .then((response) => {
            message.value = ""
            title.value = ""
            return response.json()
        })
        .then((res) => {
            addAllPost(res, false)
        })
        .catch((error)=>{
            message.value = ""
            title.value = ""
            alert(`Un problème est survenue : ${error.message}`)
        })

}

function postIndex(){

    fetch("/post/", {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    })
        .then((response)=>{
            return response.json()
        })
        .then((res)=>{
            addAllPost(res,true)
        })
        .catch((error)=>{
            alert(error.message)
        })
}

function findPostById(){

    fetch("/post/5", {
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
        })
        .catch((error)=>{
            alert(error.message)
        })
}

function updatePost(id, message, title, like, dislike){

    return fetch(`/post/${id}`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message,
            title: title,
            like: like,
            dislike: dislike,
        })
    })
        .then(()=>{
        return true
        })
        .catch(()=>{
            return false
        })
}

function deletePost(){

    fetch("/post/5",{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((reponse)=>{
            return reponse.json()
        })
        .then((res)=>{
            console.log(res.delete)
        })
        .catch((error)=>{
            alert(error.message)
        })
}


function addAllPost(response, isNotSolo){

    if (isNotSolo){
        response.forEach((post)=>{
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

function getUser(id){
     return fetch(`/user/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "applicaiton/json"
        }
    })
        .then((response)=>{
            return response.json()
        })
        .catch((error)=>{
            alert(`error ${error}`)
        })
}

function addReactions(e, isLike){

    test()
    /*let likes = getIdPostInput(e)

    let idPost = likes.getAttribute("post_id")
    let postIsUp = ""

    let postReactions = await getReactionsPost(idPost)*/


    /*if (isLike) {
        postIsUp = await updatePost(idPost,"","",parseInt(likes.textContent)+1, 0)
    }else {
        postIsUp = await updatePost(idPost,"","",0, parseInt(likes.textContent)+1)
    }

    if (postIsUp) {
        likes.textContent = parseInt(likes.textContent) + 1
    }*/
}

function getIdPostInput(e){
    let parentDiv = e.target.parentNode
    let likes = ""

    for (let i = 0; i < parentDiv.children.length;i++){
        if (parentDiv.children[i].tagName == "SPAN"){
            likes = parentDiv.children[i]
        }
    }

    return likes
}
