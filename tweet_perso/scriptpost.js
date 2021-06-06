const txt_area = document.getElementById("textArea")
const inputForm = document.getElementById("inputForm")
const inputImage = document.getElementById("file1")
const inputGif = document.getElementById("file2")
let id_post = 0

inputForm.addEventListener("click",function(){
    // bien regarder avant de cree si il y a un text
    inputForm.style.background = "rgb(72, 45, 116)";
    setTimeout(() => {
        inputForm.style.background = "rgb(121, 75, 196)";
    }, 120);   
    CreatNewPost()
})


txt_area.addEventListener("click",function(){
    document.getElementById("zoneEcriture").classList = 'expand'
})


function CreatNewPost (){
    //si lien video yt alors prévisu de la video like twitter (peut etre api yt)
    if (txt_area.value != "" | inputImage.value != "" | inputGif.value != ""){
        creationDiv()
    }
    txt_area.value = ""
    inputImage.value = ""
    inputGif.value = ""
}

function creationDiv(){
    let NewPost 
    NewPost = document.createElement('div')
    NewPost.id = `post${id_post}`
    NewPost.classList.add("tweet")

   

    /*div image profile*/
    let pp
    pp = document.createElement('div')
    pp.classList.add("pp")
        

        /*div pseudo*/
        let name
        name = document.createElement('div')
        name.classList.add("name")
        name.innerHTML = `@jesuis${id_post}`


        /*div logo pioutter*/
        let logo
        logo= document.createElement('img')
        logo.classList.add("logo")
        logo.src="/post/img/piout.png"


        /*div contenue du tweet*/
        let content
        content =document.createElement('div')
        content.classList.add("contenue")


        // ajouter un retour a la ligne
        if (inputImage.value != ""){

            content.innerHTML +=inputImage.value
        }
        if (inputGif.value != ""){
            content.innerHTML +=inputGif.value
        }


    /*div separartion*/
    let separation
    separation= document.createElement('div')
    separation.classList.add("separation")


        /*div like*/
        let like
        like= document.createElement('img')
        like.classList.add("like")
        like.src="/post/img/iconCoeurLike.png"
        like.id = `post${id_post}`



        /*div commentaire*/
        let commentaire
        commentaire= document.createElement('img')
        commentaire.classList.add("commentaire")
        commentaire.src="/post/img/comments.png"
        commentaire.id = `post${id_post}`



    NewPost.appendChild(pp)
    NewPost.appendChild(name)
    content.innerHTML = txt_area.value
    NewPost.appendChild(content)
    document.getElementById(NewPost.id).appendChild(commentaire)
    document.getElementById(NewPost.id).appendChild(like)
    document.getElementById(NewPost.id).appendChild(separation)
    document.getElementById(NewPost.id).appendChild(logo)
    document.getElementById('zonePostTweet').appendChild(NewPost)
    id_post ++
}