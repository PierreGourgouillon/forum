
export function getCommentaryPostAPI(postID){
    return fetch(`/commentary/${postID}`, {
        method: "GET",
        headers: {
            "Content-type":"application/json"
        }
    })
        .then((response)=>{
            return response.json()
        })
        .then((res)=>{

            if (res === null) {
                return "error"
            }

            if (res.error === "true"){
                return ""
            }else{
                return res
            }
        })
        .catch(()=>{
            document.location.href = "/error/"
        })
}

export function createCommentaryAPI(commentary){

    return fetch(`/commentary/`, {
        method: "POST",
        headers: {
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            postID: parseInt(commentary.postID),
            userID: commentary.userID,
            message: commentary.message,
        })
    })
        .then((response)=>{
            return response.json()
        })
        .then((res)=>{
            if (res.create === "false"){
                alert("Une erreur c'est produite")
            }else{
                return res
            }
        })
        .catch(()=>{
            document.location.href = "/error/"
        })
}

export function findPostByIdAPI(postID){

    return fetch(`/post/${postID}`, {
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

export function getUser(id){
    return fetch(`/profiluser/${id}`, {
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


export function getReactionsPost(id){
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

export function updatePost(id, message, title, like, dislike){

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

export function updateReactionOnePost (idPost, idUser, like, dislike){

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

export async function createReactionAPI(idPost, idUser, isLike){

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

