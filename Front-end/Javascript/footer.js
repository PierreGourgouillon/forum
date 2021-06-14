document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("showMore-filterBox").addEventListener("click", showMore)
})

function showMore(){
    let hidden = document.getElementById("hiddenFilter")
    let more_less = document.getElementById("showMore-filterText")
    if(hidden.style.display === "none"){
        hidden.style.display = ""
        more_less.innerText = "Voir moins"
    }else{
        hidden.style.display = "none"
        more_less.innerText = "Voir plus"
    }
}