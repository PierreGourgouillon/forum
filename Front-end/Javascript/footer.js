document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("showMore-filterBox").addEventListener("click", showMoreFilter)
    document.getElementById("showMore-sortBox").addEventListener("click", showMoreSort)
})

function showMoreFilter(){
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
function showMoreSort(){
    let hidden = document.getElementById("hiddenSort")
    let more_less = document.getElementById("showMore-sortText")
    if(hidden.style.display === "none"){
        hidden.style.display = ""
        more_less.innerText = "Voir moins"
    }else{
        hidden.style.display = "none"
        more_less.innerText = "Voir plus"
    }
}