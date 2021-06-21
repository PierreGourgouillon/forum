document.addEventListener("DOMContentLoaded", () => {
    fillSearchBar()
    document.getElementById("showMore-filterBox").addEventListener("click", showMoreFilter)
    document.getElementById("showMore-sortBox").addEventListener("click", showMoreSort)
    document.getElementById("search-button").addEventListener("click", goToPost)
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

function fillSearchBar() {
    const datalist = document.getElementById("searchBar")

    fetch("/search/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => {
            return response.json()
        })
        .then((res) => {
            res.titles.forEach((element, i) => {
                let option = document.createElement("option")
                option.value = element
                option.dataset.id = i+1
                option.dataset.myType = "title"
                datalist.appendChild(option)
            });

            res.users.forEach((element, i) => {
                let option = document.createElement("option")
                option.value = element
                option.dataset.id = i+1
                option.dataset.myType = "user"
                datalist.appendChild(option)
            });
        })
}

function goToPost() {
    let input = document.getElementById("search-input")
    input = input.value
    let data = document.getElementById("searchBar").options

    for(let i = 0; i < data.length; i++) {
        if(data[i].value.toLowerCase() == input.toLowerCase()) {
            var ID = data[i].dataset.id;
            if(data[i].dataset.myType == "title") {
                document.location.href = "/status/"+ID;
                return;
            } else if(data[i].dataset.myType == "user") {
                document.location.href = "/profil/"+ID;
                return;
            }
        }
    }
}