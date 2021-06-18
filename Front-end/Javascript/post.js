
function changeMode() {
    let css = document.getElementById("css")
    css.href = "/static/Design/CSS-Pages/Authentification/LightMode/homePage_LightMode.css"
}

function popUp(e){
    let div = e.target.parentNode
    let idPost = div.getAttribute("post_id")
    let position = div.getBoundingClientRect()
    let containerPopUp = document.getElementById("pop-up")
    containerPopUp.style.left = `${position.left -225}px`
    containerPopUp.style.top =`${position.top}px`
    containerPopUp.style.display = "block"

    let clicker = function (e){
        if (!e.target.classList.contains("popUpList")){
            containerPopUp.style.display = "none"
            document.removeEventListener("click", clicker)
        }
    }

    document.addEventListener('click', clicker)

    addEventDeletePost(idPost, div, containerPopUp)
    addEventUpdatePost(idPost)

}

function addEventUpdatePost(idPost){
    document.getElementById("updatePost").addEventListener("click", ()=>{
        let divPopUp = document.getElementById("popUp-update")
        divPopUp.style.display = "block"

        let title = document.getElementById('popUp-title-update')
        let message = document.getElementById('popUp-message-update')
        let errorSpan = document.getElementById('id-error-update')
        let buttonModif = document.getElementById('modif-post')

        document.getElementById('image-close').addEventListener('click', ()=>{
            divPopUp.style.display = "none"
        })

        buttonModif.addEventListener('click', async ()=>{
            if (title.value.length === 0 && message.value.length === 0){
                title.style.border = "2px solid red"
                message.style.border = "2px solid red"
                errorSpan.innerText = "Remplissez au moins un champ"
            }else{
                let isUpdate = await updatePost(idPost, message.value, title.value)
                if (isUpdate){
                    title.value = ""
                    message.value = ""
                    divPopUp.style.display = "none"
                    document.location.reload()
                }else{
                    title.value = ""
                    message.value = ""
                    errorSpan.innerText = "La mise à jour du post à échoué, veuillez recharger la page"
                }
            }
        })
    })
}

function addEventDeletePost(idPost, div, containerPopUp){
    document.getElementById("deletePost").addEventListener("click",()=>{
        deletePost(idPost)
            .then((isDelete)=>{
                if(isDelete){
                    div.closest("#post-parent").remove()
                    containerPopUp.style.display = "none"
                }else {
                    alert("Une erreur est survenue")
                }
            })
    })
}

function deletePost(idPOst){

        return fetch(`/post/${idPOst}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((reponse) => {
                return reponse.json()
            })
            .then((res) => {
                if (res.delete === "true") {
                    return true
                }else{
                    return false
                }
            })
            .catch(() => {
                return false
            })
}


function updatePost(id, message = "", title = "", like = -1, dislike= -1){
    return fetch(`/post/${id}`, {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            message: message,
            like: like,
            dislike: dislike,
        })
    })
        .then((response)=>{
            return response.json()
        })
        .then((res)=>{
            if (res.update === "true"){
                return true
            }else{
                return false
            }
        })
        .catch(()=>{
            document.location.href = "/error/"
        })
}
