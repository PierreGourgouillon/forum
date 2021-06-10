
document.addEventListener('DOMContentLoaded', ()=>{
    let accueil = document.getElementById("accueil")
    let profil = document.getElementById("profil")
    let darkMode = document.getElementById("mode")

    accueil.addEventListener('click', ()=>{
        document.location.href = "/home/"
    })

    profil.addEventListener('click', ()=>{
        let idUser = parseInt(getCookie("PioutterID"))

        if (idUser === 0) {
            document.location.href = "/register/"
        }else {
            document.location.href = `/profil/${idUser}`
        }
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