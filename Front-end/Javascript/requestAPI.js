
function createPost(){

    let input = document.getElementById("postMessage");
    let t = document.getElementById("test")

    fetch("/post/", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            pseudo: "pierre",
            message: input.value,
            like: 0,
            dislike: 0
        })
    })
        .then((response) => {
            input.value = ""
            return response.json()
        })
        .then((res) => {
            console.log(res)
        })
        .catch((error)=>{
            input.value = ""
            alert(`Un problème est survenue : ${error.message}`)
        })

}

function postIndex(){


    fetch("/post/", {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    })
}