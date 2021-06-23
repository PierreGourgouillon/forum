import * as popUpModule from "./Templates/popUpTemplate.js";
import * as commentaryModule from "./Templates/commentaryTemplate.js"
import * as routeAPI from "./route/route.js"
import {objectPopUp} from "./Templates/popUpTemplate.js";
import {objectCommentary} from "./Templates/commentaryTemplate.js";

document.addEventListener("DOMContentLoaded", async ()=>{
    let postID = window.location.pathname.replace('/status/', "")
    let userID = parseInt(getCookie("PioutterID"))
    let cookieDarkMode = getCookie("PioutterMode")
    let postUser = await routeAPI.findPostByIdAPI(postID)
    let user = await routeAPI.getUser(userID)
    let userAuthor = await routeAPI.getUser(postUser.IdUser)

    if (cookieDarkMode === "D"){
        document.getElementById('imgLike').src = '/static/Design/Images/Icon/like_color_white.svg'
        document.getElementById('imgDislike').src = '/static/Design/Images/Icon/dislike_color_white.svg'
        document.getElementById('imgCommentary').src = '/static/Design/Images/Icon/commentary_color_white.svg'

    }

    checkReaction(parseInt(postID), userID)
    insertDataPost(userAuthor, postUser)
    addDataPopUp(postUser, user, userAuthor)
    insertCommentariesInPage(postID)

    let eventListUserAuthor = [...document.getElementsByClassName("eventList")]
    eventListUserAuthor.forEach((element)=>{
        element.addEventListener('click', ()=>{
            document.location.href = `/profil/${postUser.IdUser}`
        })
    })

    document.getElementById("like").addEventListener('click', ()=>{
        addReactions(userID, postID, true)
    })

    document.getElementById("dislike").addEventListener('click', ()=>{
        addReactions(userID, postID, false)
    })

    document.getElementById("commentaryIcon").addEventListener("click", ()=>{
        printPopUp(postID)
    })
})

function insertDataPost(user, post){
    document.getElementById("image-user").src = "data:image/png;base64," + user.image
    document.getElementById("pseudo-user").textContent = user.pseudo
    document.getElementById("date-post").textContent = post.Date
    document.getElementById("title-user").textContent = post.title
    document.getElementById("message-post").textContent = post.message
    document.getElementById("like-post").textContent = post.like
    document.getElementById("dislike-post").textContent = post.dislike
}

function addDataPopUp(post, user, userAuthor){
    objectPopUp.imageUser = user.image
    objectPopUp.messagePost = post.message
    objectPopUp.pseudoAuthor = userAuthor.pseudo
    objectPopUp.imageAuthor = userAuthor.image
}

function printPopUp(postID){
    let container = document.getElementById("popUp-update")
    container.style.display = "block"
    container.innerHTML = popUpModule.templatepopUp(objectPopUp)

    document.getElementById("image-close").addEventListener('click', closePopUp)

    document.getElementById("sendCommentary").addEventListener("click", ()=>{
        sendCommentary(postID)
    })
}

async function sendCommentary(postId){
    let textArea  = document.getElementById("message-Comment")

    if (textArea.value.length !== 0){
        let userId = parseInt(getCookie("PioutterID"))
        let commentary = {
            postID: postId,
            userID: userId,
            message: textArea.value,
        }
        let commentaryResponse = await routeAPI.createCommentaryAPI(commentary)

        if (typeof commentary === "object"){
            routeAPI.getUser(commentary.userID)
                .then((user)=>{
                    objectCommentary.image = user.image
                    objectCommentary.pseudo = user.pseudo
                    objectCommentary.message = commentaryResponse.message
                    createCommentaryDesign()
                })
            closePopUp()
        }

    }else{
        textArea.classList.remove('valideBorder')
        textArea.classList.add('errorMessage')
    }
}

function closePopUp(){
    document.getElementById("popUp-update").style.display = "none"
}

function createCommentaryDesign(){
    let div = document.createElement("div")
    div.innerHTML = commentaryModule.templateCommentary(objectCommentary)
    document.getElementById("containerCommentary").insertAdjacentElement("afterbegin", div)
}

async function insertCommentariesInPage(postID){
   let commentaries = await routeAPI.getCommentaryPostAPI(postID)
    if (commentaries !== "error"){
        commentaries.forEach((commentary)=>{

            routeAPI.getUser(commentary.userID)
                .then((response)=>{
                    objectCommentary.message = commentary.message
                    objectCommentary.pseudo = response.pseudo
                    objectCommentary.image = response.image
                    createCommentaryDesign()
                })

        })
    }
}

async function addReactions(userId, idPost, isLike){
    let postIsUp = ""
    let postReactions = await routeAPI.getReactionsPost(idPost)
    let arrayVerif = verificationReactionInBDD(postReactions, userId)
    let isReactionInBDD = arrayVerif[0]
    let reaction = arrayVerif[1]
    let likeInput = document.querySelector("#like-post")
    let dislikeInput = document.querySelector("#dislike-post")
    let likeValue = document.getElementById("like-post").textContent
    let dislikeValue = document.getElementById("dislike-post").textContent

    if (isReactionInBDD){

        if (isLike && reaction.like === true && reaction.dislike === false){ // si il veut like alors que c'est deja like

            let updatePostFinish = await routeAPI.updatePost(idPost,"","",parseInt(likeValue) - 1 ,-1)
            let updateReactionFinish = await routeAPI.updateReactionOnePost(idPost, userId, false, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(likeInput,"filterLike", false)
            }

        }else if (isLike && reaction.like === false && reaction.dislike === false){ // si il veut like et que ca n'est pas like et dislike

            let updatePostFinish = await routeAPI.updatePost(idPost,"","",parseInt(likeValue) + 1 ,-1)
            let updateReactionFinish = await routeAPI.updateReactionOnePost(idPost, userId, true, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(likeInput, "filterLike", true)
            }

        }else if (isLike && reaction.dislike === true){  // si il veut like alors que c'est deja dislike

            let updatePostFinish = await routeAPI.updatePost(idPost,"","",parseInt(likeValue) + 1 ,parseInt(dislikeValue) - 1)
            let updateReactionFinish = await routeAPI.updateReactionOnePost(idPost, userId, true, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput,"filterDislike",false)
                changeDesignReaction(likeInput,"filterLike",true)
            }

        }else if (!isLike && reaction.dislike === true){ // si il veut dislike alors que c'est deja dislike

            let updatePostFinish = await routeAPI.updatePost(idPost,"","",-1, parseInt(dislikeValue) - 1)
            let updateReactionFinish = await routeAPI.updateReactionOnePost(idPost, userId, false, false)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput,"filterDislike",false)
            }

        }else if (!isLike && reaction.like === false && reaction.dislike === false){ // si il veut dislike et que rien n'est coché

            let updatePostFinish = await routeAPI.updatePost(idPost,"","",-1,parseInt(dislikeValue) + 1)
            let updateReactionFinish = await routeAPI.updateReactionOnePost(idPost, userId, false, true)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput, "filterDislike",true)
            }

        }else if (!isLike && reaction.like === true){ // si il veut dislike et que c'est deja like

            let updatePostFinish = await routeAPI.updatePost(idPost,"","",parseInt(likeValue) - 1 ,parseInt(dislikeValue) + 1)
            let updateReactionFinish = await routeAPI.updateReactionOnePost(idPost, userId, false, true)

            if (updatePostFinish && updateReactionFinish){
                changeDesignReaction(dislikeInput, "filterDislike",true)
                changeDesignReaction(likeInput,"filterLike", false)
            }

        }else {
            document.location.href = "/error/"
        }

    }else{
        let isCreate = await routeAPI.createReactionAPI(parseInt(idPost), userId, isLike)

        if (isCreate && isLike === true) {
            postIsUp = await routeAPI.updatePost(idPost,"","",parseInt(likeValue)+1, -1)
        }else if (isCreate && isLike === false) {
            postIsUp = await routeAPI.updatePost(idPost,"","",-1, parseInt(dislikeValue)+1)
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

async function checkReaction(postID, userID){
    let reactions = await routeAPI.getReactionsPost(postID)
    if(reactions != null) {
        reactions.forEach((reaction)=>{
            if (reaction.idUser === userID && reaction.idPost === postID) {
                if (reaction.like === true) {
                    document.getElementById("like").classList.add("filterLike")
                }else if (reaction.dislike === true) {
                    document.getElementById("dislike").classList.add("filterDislike")
                }
            }
        })
    }
}