let tabCats = {"1": "Actualité","2": "Art","3": "Cinéma","4": "Histoire","5": "Humour","6": "Internet","7": "Jeux Vidéo","8": "Nourriture", "9": "Santé", "10": "Sport"}
var compteur = false

document.addEventListener("DOMContentLoaded",()=>{
    postIndex()
    document.getElementById("b").addEventListener('click', createPost)
    addImageProfil()
    // document.getElementById("sort-button").addEventListener('click', postIndexFilter)
})

async function createPost(){
    let title = document.getElementById("insert-title")
    let message = document.getElementById("insert-message")
    let categories = [...document.getElementsByClassName("selected-category")]
    let cats = categories.map((elem) => {
        return elem.outerText
    })

    let valueCookie = getCookie("PioutterID")

    let user = await getUser(valueCookie)

    if (title.value.length === 0 || message.value.length === 0){
        title.style.border = "2px solid red"
        message.style.border = "2px solid red"
    }else{
        fetch("/post/", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                title: title.value,
                pseudo: user.pseudo,
                message: message.value,
                like: 0,
                dislike: 0,
                categories: cats
            })
        })
            .then((response) => {
                message.value = ""
                title.value = ""
                return response.json()
            })
            .then((res) => {
                addAllPost([res])
            })
            .catch((error)=>{
                message.value = ""
                title.value = ""
                alert(`Un problème est survenue : ${error.message}`)
            })
    }
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
        .catch(()=>{
            document.location.href = "/error/"
        })
}



function postIndexFilter(){
    let tabStr = []
    const url = window.location.href
    id = url.charAt(url.length-1);
    let idStr = id.toString()
    tabStr=[idStr]
    
    console.log(tabStr)
    fetch("/post/filter/", {
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            "categories":tabStr,
        })
    })
    .then((response)=>{
        return response.json()
    })
    .then((res)=>{
        addAllPostFilter(res)
    })
    .catch(()=>{
        document.location.href = "/error/"
        console.log('erreur')
    })
}

function findPostById(idUser){

    return fetch(`/post/${idUser}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((reponse)=>{
            return reponse.json()
        })
        .catch(()=>{
            return "error"
        })
}

function updatePost(id, message, title, like, dislike){
    console.log("hello")
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
            document.location.href = "/error/"
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

async function addAllPost(response){

    let reactions = await getReactions()
    let idUser = parseInt(getCookie("PioutterID"))

        response.forEach((post)=>{
            console.log("les catégories du post sont :", post.categories)

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
            let divLike = clone.getElementById("like")
            let divDislike = clone.getElementById("dislike")
            let dots = clone.getElementById("dots")
            let cats = [...clone.querySelectorAll(".styleCategory")]

            if(post.categories != null) {
                cats.forEach((elem, idx) => {
                    elem.classList.add(`colorBox${post.categories[idx]}`)
                    elem.querySelector('span').textContent = tabCats[post.categories[idx]]
                })
            }

            getProfilImage(post.IdUser)
                .then((file)=>{
                    imageProfil.src = "data:image/png;base64," + file
                })

            divLike.setAttribute("contLike", "like")
            divDislike.setAttribute("contDislike", "dislike")

            link.forEach((element)=>{
                if (element.classList.contains("pseudo-href")){
                    element.href = `/profil/${post.IdUser}`
                }else{
                    element.href = `/status/${post.PostId}`
                }
            })

            if(reactions != null) {
                reactions.forEach((reaction)=>{
                    if (reaction.idUser === idUser && reaction.idPost === post.PostId) {
                        if (reaction.like == true) {
                            divLike.classList.add("filterLike")
                        }else if (reaction.dislike == true) {
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

            if (idUser !== post.IdUser){
                clone.getElementById("dotsImg").remove()
                dots.onclick = ""
            }else{
                dots.setAttribute("post_id", post.PostId)
            }

            like.setAttribute("post_id", post.PostId)
            dislike.setAttribute("post_id", post.PostId)

            clone.getElementById("image-user").addEventListener('mouseenter', (event)=>{

                setTimeout(()=>{
                    let divPost = event.target.closest("#post-parent")
                    let idPost = divPost.querySelector("#like-post").getAttribute("post_id")
                    findPostById(idPost)
                        .then((post)=>{
                        printPopUpImages(post.IdUser, event)
                    })
                        .catch(()=>{
                            document.location.href = "/error/"
                        })
                },500)
            })

            container.append(clone)
        })
}

async function addAllPostFilter(response){

    let reactions = await getReactions()
    let idUser = parseInt(getCookie("PioutterID"))
    // console.log(response)

        response.forEach((post)=>{
            if (post.title != ""){
                console.log("les catégories du post sont :", post.categories)

                let template = document.getElementById("postTemplate")
                let clone = document.importNode(template.content, true)
                let container = document.getElementById("containerPostFiltered")
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
                let cats = [...clone.querySelectorAll(".styleCategory")]

                if(post.categories != null) {
                    cats.forEach((elem, idx) => {
                        elem.classList.add(`colorBox${post.categories[idx]}`)
                        elem.querySelector('span').textContent = tabCats[post.categories[idx]]
                    })
                }

                getProfilImage(post.IdUser)
                    .then((file)=>{
                        imageProfil.src = "data:image/png;base64," + file
                    })

                divLike.setAttribute("contLike", "like")
                divDislike.setAttribute("contDislike", "dislike")

                link.forEach((element)=>{
                    if (element.classList.contains("pseudo-href")){
                        element.href = `/profil/${post.IdUser}`
                    }else{
                        element.href = `/status/${post.PostId}`
                    }
                })

                if(reactions != null) {
                    reactions.forEach((reaction)=>{
                        if (reaction.idUser === idUser && reaction.idPost === post.PostId) {
                            if (reaction.like == true) {
                                divLike.classList.add("filterLike")
                            }else if (reaction.dislike == true) {
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

                if (idUser !== post.IdUser){
                    clone.getElementById("dotsImg").remove()
                    dots.onclick = ""
                }else{
                    dots.setAttribute("post_id", post.PostId)
                }

                like.setAttribute("post_id", post.PostId)
                dislike.setAttribute("post_id", post.PostId)

                clone.getElementById("image-user").addEventListener('mouseenter', (event)=>{

                    setTimeout(()=>{
                        let divPost = event.target.closest("#post-parent")
                        let idPost = divPost.querySelector("#like-post").getAttribute("post_id")
                        findPostById(idPost)
                            .then((post)=>{
                            printPopUpImages(post.IdUser, event)
                        })
                            .catch(()=>{
                                document.location.href = "/error/"
                            })
                    },500)
                })
                container.append(clone)
            }
        })
}

function printPopUpImages(idUser, event){
    let divPopUp = document.getElementById("jsPopupImages")

    divPopUp.addEventListener('mouseover', ()=>{
        compteur = true
    })

    let position = event.target.getBoundingClientRect()
    divPopUp.style.left = `${position.left - 125}px`

    if((screen.height - position.top) <= 200 ){
        divPopUp.style.bottom = `${position.top}px`
    }else{
        divPopUp.style.top = `${position.top + 50}px`
    }

    divPopUp.style.display = "block"
    let pseudo = document.getElementById("title-user-popUp-Image")
    let bio = document.getElementById("biography-popUp-Image")
    getProfilImage(idUser)
        .then((file)=>{
            document.getElementById("popUp-Image").src = "data:image/png;base64," + file
        })

    getUserProfil(idUser)
        .then((profil)=>{
        pseudo.innerText = profil.pseudo
        bio.innerText = profil.bio
    })
        .catch(()=>{
            document.location.href = "/error/"
        })

    divPopUp.addEventListener("mouseleave", ()=>{
        divPopUp.style.display = "none"
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

async function addReactions(e, isLike){

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

    if (isReactionInBDD){

        if (isLike && reaction.like === true && reaction.dislike === false){ // si il veut like alors que c'est deja like

            let updatePostFinish = await updatePost(idPost,"","",parseInt(input.textContent) - 1 ,-1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(likeInput,"filterLike", false)
            }

        }else if (isLike && reaction.like === false && reaction.dislike === false){ // si il veut like et que ca n'est pas like et dislike

            let updatePostFinish = await updatePost(idPost,"","",parseInt(input.textContent) + 1 ,-1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, true, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(likeInput, "filterLike", true)
            }

        }else if (isLike && reaction.dislike === true){  // si il veut like alors que c'est deja dislike

            let updatePostFinish = await updatePost(idPost,"","",parseInt(likeInput.textContent) + 1 ,parseInt(dislikeInput.textContent) - 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, true, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput,"filterDislike",false)
                changeDesignReaction(likeInput,"filterLike",true)
            }

        }else if (!isLike && reaction.dislike === true){ // si il veut dislike alors que c'est deja dislike

            let updatePostFinish = await updatePost(idPost,"","",-1, parseInt(input.textContent) - 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput,"filterDislike",false)
            }

        }else if (!isLike && reaction.like === false && reaction.dislike === false){ // si il veut dislike et que rien n'est coché

            let updatePostFinish = await updatePost(idPost,"","",-1,parseInt(input.textContent) + 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, true)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput, "filterDislike",true)
            }

        }else if (!isLike && reaction.like === true){ // si il veut dislike et que c'est deja like

            let updatePostFinish = await updatePost(idPost,"","",parseInt(likeInput.textContent) - 1 ,parseInt(dislikeInput.textContent) + 1)
            let updateReactionFinish = await updateReactionOnePost(idPost, userId, false, true)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput, "filterDislike",true)
                changeDesignReaction(likeInput,"filterLike", false)
            }

        }else {
            document.location.href = "/error/"
        }

    }else{
        let isCreate = await createReactionAPI(parseInt(idPost), userId, isLike)

        if (isCreate && isLike === true) {
            postIsUp = await updatePost(idPost,"","",parseInt(input.textContent)+1, -1)
        }else if (isCreate && isLike === false) {
            postIsUp = await updatePost(idPost,"","",-1, parseInt(input.textContent)+1)
        }

        if (postIsUp && isLike) {
            changeDesignReaction(likeInput,"filterLike", true)
        }else if(postIsUp && !isLike){
            changeDesignReaction(dislikeInput, "filterDislike", true)
        }
    }
}

function changeDesignReaction(input, classCSS, isAdd){

    if (isAdd) {
        input.parentNode.classList.add(classCSS)
        input.textContent = parseInt(input.textContent) + 1
    }else {
        input.parentNode.classList.remove(classCSS)
        input.textContent = parseInt(input.textContent) - 1
    }

}

function verificationReactionInBDD(postReactions, userId){
    let isReactionInBDD = false
    let reaction ;

    if (postReactions != null){
        for (let i=0; i < postReactions.length;i++){
            if (postReactions[i].idUser === userId) {
                reaction = postReactions[i]
                isReactionInBDD = true
            }
        }
    }

    return [isReactionInBDD, reaction]
}

function getReactionInput(e){
    let parentDiv = e.target.parentNode
    let likes = ""

    for (let i = 0; i < parentDiv.children.length;i++){
        if (parentDiv.children[i].tagName == "SPAN"){
            likes = parentDiv.children[i]
        }
    }

    return likes
}

function getReactions(){
    return fetch("/reaction/",{
        method: "GET",
        headers : {
            "Content-Type": "application/json"
        }
    })
        .then((res)=>{
            return res.json()
        })
        .catch((err)=>{
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
        .then(()=>{
            return true
        })
        .catch(()=>{
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
        .then((res)=>{
            return res.json()
        })
        .then((response)=>{
            return response
        })
        .catch((err)=>{
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
        .then(()=>{
            return true
        })
        .catch(()=>{
            return false
        })

}


function getUserProfil(idUser) {

    return fetch(`/profiluser/${idUser}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((reponse) =>  {
            return reponse.json()
        })
        .catch(() => {
            return "error"
        })
}

function addImageProfil(){
    let idUser = parseInt(getCookie("PioutterID"))
    getProfilImage(idUser)
        .then((file)=>{
            document.getElementById("create-post-image").src = "data:image/png;base64," + file
            document.getElementById("headerImage").src = "data:image/png;base64," + file
        })
}


function getProfilImage(id) {

    return fetch(`/profiluser/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((reponse) =>  {
            return reponse.json()
        })
        .then((res)=>{
            return res.image
        })
        .catch((error) => {
            console.log("Profil non trouvé")
        })
}

function deactivateAccount(){
    let idUser = parseInt(getCookie("PioutterID"))
    console.log("cookie:", idUser)

    fetch(`/profildeactivate/${idUser}`, {
        method: "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "idUser": idUser,
            "deactivate" : true,
        })
    })
    .then((response)=>{
        return response.json()
    }).then((res)=>{
        console.log('valid')
        if (res.delete){
            document.cookie = "PioutterID=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.location.href="/profildeactive/valid"
        }else{
            document.location.href="/profildeactive/nonValid"
            console.log("nonValid")
        }
    })
    .catch(()=>{
        document.location.href="/profildeactive/nonValid"
        console.log("catch")
        return false
    })

}

function changePassword(){
    let newPassword = document.getElementById("newPassword").value
    let actualPassword = document.getElementById("passwordActuel").value

    console.log(actualPassword)
    
    if (testGeneral()){
        let idUser = parseInt(getCookie("PioutterID"))
        fetch(`/profilpassword/${idUser}`, {
            method: "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                "password" : newPassword,
                "actualPassword" : actualPassword,
            })
        })
        .then((response)=>{
            return response.json()
        }).then((res)=>{
            if (res.change){
                document.location.href="/profilpassword/valid"
                console.log('redirection ...')
            }else{
                document.location.href="/profilpassword/nonValid"
                console.log('mdp actuel différent')
            }
        })
        .catch(()=>{
            return false
        })
    }
}

function changePseudo(){
    let idUser = parseInt(getCookie("PioutterID"))
    const newPseudo = document.getElementById("passwordActuel").value

    fetch(`/profilpseudo/${idUser}`, {
        method: "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "idUser": idUser,
            "pseudo" : newPseudo,
        })
    })
    .then((response)=>{
        return response.json()
    }).then((res)=>{
        if (res.valid){
            console.log("valid")
            document.location.href="/profilpseudo/valid"

        }else{
            console.log("nonValid")
            document.location.href="/profilpseudo/nonValid"
        }
    })
    .catch(()=>{
        console.log("catch")
        return false
    })

}

function changeLocation(){
    let idUser = parseInt(getCookie("PioutterID"))
    const newLocation = document.getElementById("input").value

    fetch(`/profillocation/${idUser}`, {
        method: "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "idUser": idUser,
            "location" : newLocation,
        })
    })
    .then((response)=>{
        return response.json()
    }).then((res)=>{
        if (res.change){
            console.log("valid")
            document.location.href="/profillocation/valid"

        }else{
            console.log("nonValid")
            document.location.href="/profillocation/nonValid"
        }
    })
    .catch(()=>{
        console.log("catch")
        return false
    })

}



