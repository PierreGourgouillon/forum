const txt_area = document.getElementById("post__textarea")
const btn_txt = document.getElementById("submit__btn")
let id_post = 0

btn_txt.addEventListener("click",function(){
    // bien regarder avant de cree si il y a un text
    CreatNewPost()
    btn_txt.style.background = "green"
    setTimeout(() => {
        btn_txt.style.background = "#4d4d4d"
    }, 100);
        
})

function CreatNewPost (){
    let NewPost 
    NewPost = document.createElement('div')
    NewPost.id = `post${id_post}`
    NewPost.classList.add("post")
    document.getElementById('post_view_area').appendChild(NewPost)

    let auteur
    auteur = document.createElement('h1')
    auteur.innerHTML = `@jesuis${id_post}`

    let content
    content =document.createElement('p')
    content.innerHTML = txt_area.value


    NewPost.appendChild(auteur)
    NewPost.appendChild(content)

    id_post ++
    

}