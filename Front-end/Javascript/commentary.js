const templateCommentary = `
         <div class="globalFLex" style="cursor: default">
                    <div class="globalFLex paddingLeft border">
                        <div class="RowFlex" style="padding-top: 10px;width: 100%">
                            <div class="globalFLex">
                                <div class="globalFLex" style="width: 40px;border-radius: 999px;align-items: center">
                                    <img src="/static/Design/Images/avatar.jpg" style="border-radius: 999px; width: 90%">
                                </div>
                            </div>

                            <div class="globalFLex" style="margin-left: 10px; width: 95%">
                                <div class="globalFLex" style="margin-top: 8px">
                                    <span id="pseudo-commentary">${1+1}</span>
                                </div>

                                <div class="globalFLex" style="width: 100%">
                                    <p id="message-commentary">hsdiufbdsifhs uihfisdjohfiusdhfiu uihfisdjohfiusdhfiu uihfisdjohfiusdhfiu çufsdhiufhdsuiofçufsdhiufhdsuiofçufsdhiufhdsuiof çufsdhiufhdsuiof uihfdsiuofhiusdohfsi uifsdhuifhsdiuo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`

document.addEventListener("DOMContentLoaded", ()=>{
    let postID = window.location.pathname.replace('/status/', "")

    findPostById(postID)

    getCommentaryPost(1)
        .then((res)=>{
            console.log(res)
        })

})

function getCommentaryPost(postID){
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


function createCommentary(postID, userID, message){
    return fetch(`/commentary/`, {
        method: "POST",
        headers: {
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            postID: postID,
            userID: userID,
            message: message,
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


function insertDataPost(post){
    let img = document.getElementById("image-user")
    let pseudo = document.getElementById("pseudo-user")
    let date = document.getElementById("date-post")
    let title = document.getElementById("title-user")
    let message = document.getElementById("message-post")
    let like = document.getElementById("like-post")
    let dislike = document.getElementById("dislike-post")
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
