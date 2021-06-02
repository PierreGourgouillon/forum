const txt_area = document.getElementById("textArea")
const btn_txt = document.getElementById("inputForm")
let id_post = 0

btn_txt.addEventListener("click",function(){
    // bien regarder avant de cree si il y a un text
    CreatNewPost()
    btn_txt.style.background = "green"
    setTimeout(() => {
        btn_txt.style.background = "rgb(46, 154, 194)"
    }, 120);
        
})

function CreatNewPost (){
    if (txt_area.value != ""){
        /*div general*/
        let NewPost 
        NewPost = document.createElement('div')
        NewPost.id = `post${id_post}`
        NewPost.classList.add("tweet")
        document.getElementById('test').appendChild(NewPost)

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
            logo.src="/tweet_perso/img/piout.png"
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
            like.src="/tweet_perso/img/iconCoeurLike.png"
            like.id = `post${id_post}`
            document.getElementById(NewPost.id).appendChild(like)


            /*div commentaire*/
            let commentaire
            commentaire= document.createElement('img')
            commentaire.classList.add("commentaire")
            commentaire.src="/tweet_perso/img/comments.png"
            commentaire.id = `post${id_post}`
            document.getElementById(NewPost.id).appendChild(commentaire)

        id_post ++
    }
}


txt_area.addEventListener("click",function(){
    document.getElementById("zoneEcriture").classList = 'expand'
})
