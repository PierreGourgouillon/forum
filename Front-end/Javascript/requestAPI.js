
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
            console.log(res)
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
            addAllPost(res)
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

function updatePost(){

    fetch("/post/5", {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Le message est modif ahah",
            title: "Le titre est modif"
        })
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


function addAllPost(response){

    response.forEach((post)=>{
        let template = document.getElementById("postTemplate")
        let clone = document.importNode(template.content, true)
        let container = document.getElementById("containerPost")

        let linkPost = clone.getElementById("link-post")
        let imageProfil = clone.getElementById("image-user")
        let pseudo = clone.getElementById("pseudo-user")
        let title = clone.getElementById("title-user")
        let messagePost = clone.getElementById("message-post")
        let like = clone.getElementById("like-post")
        let dislike = clone.getElementById("dislike-post")

        linkPost.href = `/post/${post.PostId}`
        pseudo.textContent = post.pseudo
        title.textContent = post.title
        messagePost.textContent += post.message
        like.textContent = post.like
        dislike.textContent = post.dislike

        container.append(clone)
    })

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
