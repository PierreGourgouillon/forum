import * as routeAPI from "../route/route.js"

document.addEventListener("DOMContentLoaded", ()=>{
    let userID = parseInt(getCookie("PioutterID"))
    console.log("hello", userID)
    routeAPI.getUser(userID)
        .then((user)=>{
            document.getElementById("pseudo-user-deactivate").textContent = user.pseudo
            document.getElementById("profile-image-deactivate").src = "data:image/png;base64," + user.image
        })

    document.getElementById("buttonDeactivAcc").addEventListener('click', deactivateAccount)
    document.getElementById("lineDeactivate").addEventListener('click', ()=>{
        document.location.href = `/profil/${userID}`
    })
})