document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("insert-message").addEventListener("keyup", showButton)
    document.getElementById("category-boxs").addEventListener("click", chooseCategory)
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

function chooseCategory(){
    let category = document.getElementById("cat")
}
