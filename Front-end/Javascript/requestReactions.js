
function getReactions(){
    fetch("/reaction/",{
        method: "GET",
        headers : {
            "Content-Type": "application/json"
        }
    })
        .then((res)=>{
            return res.json()
        })
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>{
            alert(err)
        })
}

function createReaction(){

    fetch("/reaction/", {
        method: "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "idPost" : 1 ,
            "idUser" : 15 ,
            "like" : true ,
            "dislike" : true
        })
    })
        .then((res)=>{
            return res.json()
        })
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>{
            alert(err)
        })
}

function getReactionsPost(){
    fetch("/reaction/1", {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    })
        .then((res)=>{
            return res.json()
        })
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>{
            alert(err)
        })
}

function UpdateReactionOnePost (){

    fetch("/reaction/1", {
        method: "PUT",
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "idPost" : 1 ,
            "idUser" : 18 ,
            "like" : false ,
            "dislike" : false
        })
    })
        .then((res)=>{
            return res.json()
        })
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>{
            alert(err)
        })

}
