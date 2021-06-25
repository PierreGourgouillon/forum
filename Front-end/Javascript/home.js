document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("insert-message").addEventListener("keyup", showButton)
    const cats = [...document.getElementsByClassName("category-box")]
    cats.forEach((cat) => cat.addEventListener("click", () => {
        chooseCategory(cat)
    }))
})

function showButton(){
    let button = document.getElementById("b")
    let message = document.getElementById("insert-message")
    if (message.value != ""){
        button.style.visibility = "visible"
    }else{
        button.style.visibility = "hidden"
    }
}

let tabCat = []

function chooseCategory(cat){
    const len = document.getElementById(("category-boxs")).querySelectorAll('.active').length
    let category = cat.querySelector('span')
    console.log("span 1", category.classList)
    if(cat.classList.value.includes('active')) {
        cat.classList.remove('active')
        category.classList.remove('selected-category')
        console.log("span 2", category.classList)
        tabCat.forEach((elem, idx) => {
            if(elem == cat) {
                tabCat.splice(idx, 1)
            }
        })
    } else {
        if(len >= 2) {
            tabCat[0].classList.remove('active')
            tabCat[0].querySelector('span').classList.remove('selected-category')
            tabCat.shift()
        }
        cat.classList.add('active')
        category.classList.add('selected-category')
        tabCat.push(cat)
    }
}

function deleteChild() {
    console.log('delete')
    const b = document.getElementById("containerPost")
    b.innerHTML = ""
    console.log(b.innerHTML)
}


