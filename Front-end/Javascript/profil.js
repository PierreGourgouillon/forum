// document.addEventListener("DOMContentLoaded", )
// document.addEventListener("DOMContentLoaded", )
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('image-close').addEventListener('click', () => {
        let divPopUp = document.getElementById("popUp-update")
        divPopUp.style.display = "none"
    })

    const isDelete = deleteGear()
    if(!isDelete) {
        document.getElementById("gear").addEventListener("click", inputBio)
        document.getElementById("send").addEventListener("click", updateBio)
    } else {
        document.getElementById("onglet-reactions").textContent = "Ses Réactions"
        document.getElementById("onglet-post").textContent = "Ses Posts"
    }

    document.getElementById("onglet-reactions").addEventListener("click", displayReactions)
    document.getElementById("onglet-post").addEventListener("click", displayPosts)

    getProfilUser()
    getPostsUser()
    getPostsLikedUser()
})

function displayReactions() {
    let l = document.getElementById("containerPostLiked")
    let p = document.getElementById("containerPost")
    let op = document.getElementById("onglet-post")
    let ol = document.getElementById("onglet-reactions")

    l.style.display = "block"
    ol.style.color = "#A266FC"
    p.style.display = "none"
    if(valueOfCookie("PioutterMode") === "L") {
        op.style.color = "black"
    } else {
        op.style.color = "white"
    }
    
}

function displayPosts() {
    let l = document.getElementById("containerPostLiked")
    let p = document.getElementById("containerPost")
    let op = document.getElementById("onglet-post")
    let ol = document.getElementById("onglet-reactions")

    l.style.display = "none"
    if(valueOfCookie("PioutterID") === "L") {
        ol.style.color = "black"
    } else {
        ol.style.color = "white"
    }
    p.style.display = "block"
    op.style.color = "#A266FC"
}


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
        addAllPost(res.postsuser, 1)
        addAllPost(res.postsliked, 2)
    })
    .catch((error) => {
        console.log(error)
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
    div.style.display = "block"
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

    let div = document.getElementById("popUp-update")
    div.style.display = "none"
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

async function addAllPost(response, choice) {

    let reactions = await getReactions()
    let idUser = parseInt(getCookie("PioutterID"))

    response.forEach((post) => {
        let container
        let template = document.getElementById("postTemplate")
        let clone = document.importNode(template.content, true)
        if(choice === 1) {
            container = document.getElementById("containerPost")
        } else if(choice === 2) {
            container = document.getElementById("containerPostLiked")
        }
        let imageProfil = clone.getElementById("image-user")
        let pseudo = clone.getElementById("pseudo-user")
        let title = clone.getElementById("title-user")
        let messagePost = clone.getElementById("message-post")
        let like = clone.getElementById("like-post")
        let dislike = clone.getElementById("dislike-post")
        let link = [...clone.querySelectorAll(".postLinkos")]
        let divLike = clone.getElementById("like")
        let divDislike = clone.getElementById("dislike")
        let dots = clone.getElementById("dots")

        divLike.setAttribute("contLike", "like")
        divDislike.setAttribute("contDislike", "dislike")

        link.forEach((element) => {
            if(element.classList.contains("pseudo-href")) {
                element.href = `/profil/${post.IdUser}`
            } else {
                element.href = `/status/${post.PostId}`
            }
        })

        if(reactions != null) {
            reactions.forEach((reaction) => {
                if (reaction.idUser === idUser && reaction.idPost === post.PostId) {
                    if(reaction.like == true) {
                        divLike.classList.add("filterLike")
                    } else if (reaction.dislike == true) {
                        divDislike.classList.add("filterDislike")
                    }
                }
            })
        }

        pseudo.textContent = post.pseudo
        title.textContent = post.title
        messagePost.textContent += post.message
        like.textContent = post.like
        dislike.textContent = post.dislike

        dots.setAttribute("post_id", post.PostId)
        like.setAttribute("post_id", post.PostId)
        dislike.setAttribute("post_id", post.PostId)

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

function getUser(id) {

    return fetch(`/user/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "applicaiton/json"
        }
    })
    .then((response) => {
        return response.json()
    })
    .catch((error) => {
        alert(`error ${error}`)
    })
}

async function addReactions(e, isLike) {

    let userId = parseInt(getCookie("PioutterID"))
    let input = getReactionInput(e)
    let idPost = input.getAttribute("post_id")
    let postIsUp = ""
    let postReactions = await getReactionsPost(idPost)
    let arrayVerif = verificationReactionInBDD(postReactions, userId)
    let isReactionInBDD = arrayVerif[0]
    let reaction = arrayVerif[1]
    let containerLikeDislike = input.parentNode.parentNode
    let likeInput = containerLikeDislike.querySelector("#like-post")
    let dislikeInput = containerLikeDislike.querySelector("#dislike-post")

    if(isReactionInBDD) {

        if(isLike && reaction.like === true && reaction.dislike === false) { // si il veut like alors que c'est deja like

            let updatePostFinish = await updatePost(idPost,"","",parseInt(input.textContent) - 1 ,-1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, false)

            if(updatePostFinish && updateReactionFinish) {
                changeDesignReaction(likeInput,"filterLike", false)
            }

        } else if(isLike && reaction.like === false && reaction.dislike === false) { // si il veut like et que ca n'est pas like et dislike

            let updatePostFinish = await updatePost(idPost,"","",parseInt(input.textContent) + 1 ,-1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, true, false)

            if(updatePostFinish && updateReactionFinish) {
                changeDesignReaction(likeInput, "filterLike", true)
            }

        } else if(isLike && reaction.dislike === true) {  // si il veut like alors que c'est deja dislike

            let updatePostFinish = await updatePost(idPost,"","",parseInt(likeInput.textContent) + 1 ,parseInt(dislikeInput.textContent) - 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, true, false)

            if(updatePostFinish && updateReactionFinish) {
                changeDesignReaction(dislikeInput,"filterDislike",false)
                changeDesignReaction(likeInput,"filterLike",true)
            }

        } else if(!isLike && reaction.dislike === true) { // si il veut dislike alors que c'est deja dislike

            let updatePostFinish = await updatePost(idPost,"","",-1, parseInt(input.textContent) - 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput,"filterDislike",false)
            }

        } else if(!isLike && reaction.like === false && reaction.dislike === false ) { // si il veut dislike et que rien n'est coché

            let updatePostFinish = await updatePost(idPost,"","",-1,parseInt(input.textContent) + 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, true)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput, "filterDislike",true)
            }

        } else if(!isLike && reaction.like === true) { // si il veut dislike et que c'est deja like

            let updatePostFinish = await updatePost(idPost,"","",parseInt(likeInput.textContent) - 1 ,parseInt(dislikeInput.textContent) + 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, true)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput, "filterDislike",true)
                changeDesignReaction(likeInput,"filterLike", false)
            }

        } else {
            document.location.href = "/error/"
        }

    } else {
        let isCreate = await createReactionAPI(parseInt(idPost), userId, isLike)

        if(isCreate && isLike === true) {
            postIsUp = await updatePost(idPost,"","",parseInt(input.textContent)+1, -1)
        } else if(isCreate && isLike === false) {
            postIsUp = await updatePost(idPost,"","",-1, parseInt(input.textContent)+1)
        }

        if (postIsUp && isLike) {
            changeDesignReaction(likeInput,"filterLike", true)
        } else if(postIsUp && !isLike) {
            changeDesignReaction(dislikeInput, "filterDislike", true)
        }
    }
}

function changeDesignReaction(input, classCSS, isAdd) {

    if(isAdd) {
        input.parentNode.classList.add(classCSS)
        input.textContent = parseInt(input.textContent) + 1
    } else {
        input.parentNode.classList.remove(classCSS)
        input.textContent = parseInt(input.textContent) - 1
    }

}

function verificationReactionInBDD(postReactions, userId) {
    let isReactionInBDD = false
    let reaction ;

    if(postReactions != null) {
        for(let i=0; i < postReactions.length;i++) {
            if(postReactions[i].idUser === userId) {
                reaction = postReactions[i]
                isReactionInBDD = true
            }
        }
    }

    return [isReactionInBDD, reaction]
}

function getReactionInput(e) {
    let parentDiv = e.target.parentNode
    let likes = ""

    for (let i = 0; i < parentDiv.children.length;i++){
        if (parentDiv.children[i].tagName == "SPAN"){
            likes = parentDiv.children[i]
        }
    }

    return likes
}

function getReactions() {
    return fetch("/reaction/", {
        method: "GET",
        headers : {
            "Content-Type": "application/json"
        }
    })
    .then((res) => {
        return res.json()
    })
    .catch((err) => {
        alert(err)
    })
}

function createReactionAPI(idPost, idUser, isLike){

    let like = false ;
    let dislike = false ;

    (isLike) ? like=true : dislike=true


    return fetch("/reaction/", {
        method: "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "idPost" : idPost ,
            "idUser" : idUser ,
            "like" : like ,
            "dislike" : dislike
        })
    })
    .then(() => {
        return true
    })
    .catch(() => {
        return false
    })
}

function getReactionsPost(id){

    return fetch(`/reaction/${id}`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    })
    .then((res) => {
        return res.json()
    })
    .then((response) => {
        return response
    })
    .catch((err) => {
        alert(err)
    })
}

function updateReactionOnePost (idPost, idUser, like, dislike){

    return fetch(`/reaction/${idPost}`, {
        method: "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "idPost" : idPost ,
            "idUser" : idUser ,
            "like" : like ,
            "dislike" : dislike
        })
    })
    .then(() => {
        return true
    })
    .catch(() => {
        return false
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
    .then(() => {
        return true
    })
    .catch(() => {
        document.location.href = "/error/"
    })
}