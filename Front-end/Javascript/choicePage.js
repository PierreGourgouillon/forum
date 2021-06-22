document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("invite").addEventListener("click", InviteCookie)
})

function InviteCookie() {
    document.cookie = `PioutterID=0; path=/`
    document.location.href="/home/"
}