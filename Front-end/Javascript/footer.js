document.addEventListener("DOMContentLoaded", () => {
    fillSearchBar()
    document.getElementById("search-button").addEventListener("click", goToPost)
    document.getElementById("showMore-filterBox").addEventListener("click", showMoreFilter)
    document.getElementById("showMore-sortBox").addEventListener("click", showMoreSort)
    const filters = [...document.querySelectorAll("#filter > div")]
    filters.forEach((filter) => filter.addEventListener("click", () => {
        chooseFilter(filter)
    }))

    const tries= [...document.querySelectorAll("#trie > div")]
    tries.forEach((trie) => trie.addEventListener("click", () => {
        chooseTrie(trie)
    }))
    document.getElementById("filter-button").addEventListener("click", pushFilter)
})

function showMoreFilter(){
    let hidden1 = document.getElementById("hiddenFilter1")
    let hidden2 = document.getElementById("hiddenFilter2")
    let hidden3 = document.getElementById("hiddenFilter3")
    let hidden4 = document.getElementById("hiddenFilter4")
    let hidden5 = document.getElementById("hiddenFilter5")
    let hidden6 = document.getElementById("hiddenFilter6")
    let more_less = document.getElementById("showMore-filterText")
    let sort = document.getElementById("container-sort")
    if(hidden1.style.display === "none"){
        hidden1.style.display = ""
        hidden2.style.display = ""
        hidden3.style.display = ""
        hidden4.style.display = ""
        hidden5.style.display = ""
        hidden6.style.display = ""
        more_less.innerText = "Voir moins"
        sort.style.display = "none"
    }else{
        hidden1.style.display = "none"
        hidden2.style.display = "none"
        hidden3.style.display = "none"
        hidden4.style.display = "none"
        hidden5.style.display = "none"
        hidden6.style.display = "none"
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
    const len = document.getElementById("filter").querySelectorAll('.active2').length

    let fil = filter.querySelector('span')

    if(filter.classList.value.includes('active2')) {
        filter.classList.remove('active2')
        fil.classList.remove('selected-category2')
        tabFilter.pop()
    } else {
        if(len >= 1) {
            tabFilter[0].classList.remove('active2')
            tabFilter[0].querySelector('span').classList.remove('selected-category2')
            tabFilter.shift()
        }
        filter.classList.add('active2')
        fil.classList.add('selected-category2')
        tabFilter.push(filter)

        console.log(filter)
    }
}

function pushFilter(){
    let filter = [...document.getElementsByClassName("selected-category2")]
    console.log("filter = ", filter)
    let id = filter[0].innerText
    console.log("id = ", id)
    let value = Object.keys(tabCats).find(key => tabCats[key] === id)
    console.log("value = ", value)
    document.location.href = "/filter/"+value
}

function chooseTrie(filter){
    const len = document.getElementById("filter").querySelectorAll('.active3').length

    let fil = filter.querySelector('span')

    if(filter.classList.value.includes('active3')) {
        filter.classList.remove('active3')
        fil.classList.remove('selected-category3')
        tabFilter.pop()
    } else {
        if(len >= 1) {
            tabFilter[0].classList.remove('active3')
            tabFilter[0].querySelector('span').classList.remove('selected-category3')
            tabFilter.shift()
        }
        filter.classList.add('active3')
        fil.classList.add('selected-category3')
        tabFilter.push(filter)

        console.log(filter)
    }
}



