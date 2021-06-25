document.addEventListener("DOMContentLoaded", () => {
    fillSearchBar()
    document.getElementById("search-button").addEventListener("click", goToPost)
    document.getElementById("showMore-filterBox").addEventListener("click", showMoreFilter)
    const filters = [...document.querySelectorAll("#filter > div")]
    filters.forEach((filter) => filter.addEventListener("click", () => {
        chooseFilter(filter)
    }))

    const tries = [...document.querySelectorAll("#sort > div")]
    tries.forEach((trie) => trie.addEventListener("click", () => {
        chooseTrie(trie)
    }))
    document.getElementById("filter-button").addEventListener("click", pushFilter)
    document.getElementById("sort-button").addEventListener("click", postIndexTrie)
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
    let displayArrow = document.getElementById("filter-button")
    const len = document.getElementById("filter").querySelectorAll('.active2').length
    let fil = filter.querySelector('span')

    if(filter.classList.value.includes('active2')) {
        filter.classList.remove('active2')
        fil.classList.remove('selected-category2')
        displayArrow.style.display = "none"
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
        displayArrow.style.display = ""
        console.log(filter)
    }
}

function pushFilter(){
    let filter = [...document.getElementsByClassName("selected-category2")]
    let id = filter[0].innerText
    let value = Object.keys(tabCats).find(key => tabCats[key] === id)
    document.location.href = "/filter/"+value
}

let tabTrie = []
let tabSelect = []
function chooseTrie(trie){
    const len = document.getElementById("sort").querySelectorAll('.active3').length
    let displayArrow = document.getElementById("sort-button")
    let tri = trie.querySelector('span')

    if(trie.classList.value.includes('active3')) {
        trie.classList.remove('active3')
        tri.classList.remove('selected-category3')
        displayArrow.style.display = "none"
        tabTrie.pop()
        tabSelect.pop()
    } else {
        if(len >= 1) {
            tabSelect[0].classList.remove('active3')
            tabSelect[0].querySelector('span').classList.remove('selected-category3')
            tabTrie.shift()
            tabSelect.shift()
        }
        trie.classList.add('active3')
        tri.classList.add('selected-category3')
        console.log(tri.id)
        tabSelect.push(trie)
        tabTrie.push(tri.id)
        displayArrow.style.display = ""

        console.log(trie)
    }
}



