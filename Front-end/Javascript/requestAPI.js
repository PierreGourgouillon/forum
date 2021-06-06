
function createPost(){

    let input = document.getElementById("postMessage");
    let t = document.getElementById("test")

    fetch("/post/", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            title: "Le titre",
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
        .then((response)=>{
            return response.json()
        })
        .then((res)=>{
            console.log(res)
        })
        .catch((error)=>{
            alert(error.message)
        })
}

function findPostById(){

    fetch("/post/5", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((reponse)=>{
            return reponse.json()
        })
        .then((res)=>{
            console.log(res)
        })
        .catch((error)=>{
            alert(error.message)
        })
}

function updatePost(){

    fetch("/post/5", {
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Le message est modif ahah",
            title: "Le titre est modif"
        })
    })
}