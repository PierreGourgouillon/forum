const txt_area = document.getElementById("textArea")
const inputForm = document.getElementById("inputForm")
let id_post = 0

inputForm.addEventListener("click",function(){
    // bien regarder avant de cree si il y a un text
    inputForm.style.background = "rgb(72, 45, 116)";
    setTimeout(() => {
        inputForm.style.background = "rgb(121, 75, 196)";
        
        console.log(inputForm.style.background)
    }, 120);   
    CreatNewPost()
})

function CreatNewPost (){
    if (txt_area.value != ""){
        /*div general*/
        let NewPost 
        NewPost = document.createElement('div')
        NewPost.id = `post${id_post}`
        NewPost.classList.add("tweet")
        document.getElementById('zonePostTweet').appendChild(NewPost)

            /*div image profile*/
            let pp
            pp = document.createElement('div')
            pp.classList.add("pp")
            NewPost.appendChild(pp)

            /*div pseudo*/
            let name
            name = document.createElement('div')
            name.classList.add("name")
            name.innerHTML = `@jesuis${id_post}`
            NewPost.appendChild(name)

            /*div logo pioutter*/
            let logo
            logo= document.createElement('img')
            logo.classList.add("logo")
            logo.src="/tweet-perso/img/piout.png"
            document.getElementById(NewPost.id).appendChild(logo)

            /*div contenue du tweet*/
            let content
            content =document.createElement('div')
            content.classList.add("contenue")
            content.innerHTML = txt_area.value
            NewPost.appendChild(content)

        /*div separartion*/
        let separation
        separation= document.createElement('div')
        separation.classList.add("separation")
        document.getElementById(NewPost.id).appendChild(separation)

            /*div like*/
            let like
            like= document.createElement('img')
            like.classList.add("like")
            like.src="/tweet-perso/img/iconCoeurLike.png"
            like.id = `post${id_post}`
            document.getElementById(NewPost.id).appendChild(like)


            /*div commentaire*/
            let commentaire
            commentaire= document.createElement('img')
            commentaire.classList.add("commentaire")
            commentaire.src="/tweet-perso/img/comments.png"
            commentaire.id = `post${id_post}`
            document.getElementById(NewPost.id).appendChild(commentaire)

        id_post ++
    }
    txt_area.value = ""
}


txt_area.addEventListener("click",function(){
    document.getElementById("zoneEcriture").classList = 'expand'
})
