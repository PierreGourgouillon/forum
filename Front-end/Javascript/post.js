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

    document.getElementById("updatePost").addEventListener("click", ()=>{

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