document.addEventListener("DOMContentLoaded", () => {
    fillSearchBar()
    document.getElementById("search-button").addEventListener("click", goToPost)
    document.getElementById("showMore-filterBox").addEventListener("click", showMoreFilter)
    document.getElementById("showMore-sortBox").addEventListener("click", showMoreSort)
    const filters = [...document.querySelectorAll("#filter > div")]
    filters.forEach((filter) => filter.addEventListener("click", () => {
        chooseFilter(filter)
    }))

})

function showMoreFilter(){
    let hidden = document.getElementById("hiddenFilter")
    let more_less = document.getElementById("showMore-filterText")
    let sort = document.getElementById("container-sort")
    if(hidden.style.display === "none"){
        hidden.style.display = ""
        more_less.innerText = "Voir moins"
        sort.style.display = "none"
    }else{
        hidden.style.display = "none"
        more_less.innerText = "Voir plus"
        sort.style.display = ""
    }
}
function showMoreSort(){
    let hidden = document.getElementById("hiddenSort")
    let more_less = document.getElementById("showMore-sortText")
    let filter = document.getElementById("container-filter")
    if(hidden.style.display === "none"){
        hidden.style.display = ""
        more_less.innerText = "Voir moins"
        filter.style.display = "none"
    }else{
        hidden.style.display = "none"
        more_less.innerText = "Voir plus"
        filter.style.display = ""
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

let tabFilter = []
function chooseFilter(filter){
    const len = document.getElementById("filter").querySelectorAll('.active').length

    let fil = filter.querySelector('button')

    if(filter.classList.value.includes('active')) {
        filter.classList.remove('active')
        fil.classList.remove('selected-category2')
        tabFilter.forEach((elem, idx) => {
            if(elem == filter) {
                tabFilter.splice(idx, 1)
            }
        })
    } else {
        if(len >= 1) {
            tabFilter[0].classList.remove('active')
            tabFilter[0].querySelector('button').classList.remove('selected-category2')
            tabFilter.shift()
        }
        filter.classList.add('active')
        fil.classList.add('selected-category2')
        tabFilter.push(filter)

        return tabFilter
    }
}