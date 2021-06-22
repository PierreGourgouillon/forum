
document.addEventListener('DOMContentLoaded', async ()=>{
    let accueil = document.getElementById("accueil")
    let profil = document.getElementById("profil")
    let settings = document.getElementById("settings")
    // let darkMode = document.getElementById("mode")
    let pseudo = document.getElementById("pseudoname")
    let idUser = parseInt(getCookie("PioutterID"))

    accueil.addEventListener('click', ()=>{
        document.location.href = "/home/"
    })

    profil.addEventListener('click', ()=>{

        if (idUser === 0) {
            document.location.href = "/register/"
        }else {
            document.location.href = `/profil/${idUser}`
        }
    })

    settings.addEventListener("click", ()=>{
        document.location.href = "/settings/"
    })

    if(idUser === 0){
        pseudo.textContent = "Inconnu"
    }else {
        fetch(`/user/${idUser}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
            .then((response)=>{
                return response.json()
            })
            .then((res)=>{
                pseudo.textContent = res.pseudo
            })
            .catch(()=>{
                document.location.href = "/"
            })
    }


    document.getElementById("margin").addEventListener("click", ()=>{
        console.log("hello")
        let userID = parseInt(getCookie("PioutterID"))
        document.location.href = `/profil/${userID}`
    })
})

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
