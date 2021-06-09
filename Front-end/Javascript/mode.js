document.addEventListener("DOMContentLoaded", chargeMode)
document.addEventListener("DOMContentLoaded", () => document.getElementById("mode").addEventListener("click", changeMode))

function changeMode() {
    let value = valueOfCookie("PioutterMode")
    let head = document.head
    let css = head.querySelector("link")
    
    if(value === "L") {
        const regEx = new RegExp("DarkMode", "g")
        css.href = css.href.replace(regEx, "LightMode")
        document.cookie = "PioutterMode=D; path=/"
    } else if(value === "D") {
        const regEx = new RegExp("LightMode", "g")
        css.href = css.href.replace(regEx, "DarkMode")
        document.cookie = "PioutterMode=L; path=/"
    }

    document.location.reload()
}

function chargeMode() {
    let head = document.head
    let css = head.querySelector("link")
    let value = valueOfCookie("PioutterMode")
    
    if(value === "D") {
        const regEx = new RegExp("LightMode", "g")
        css.href = css.href.replace(regEx, "DarkMode")
    }
}

function valueOfCookie(cookie) {
    console.log(document.cookie)
    let start = document.cookie.indexOf(`${cookie}=`) + cookie.length + 1
    let end = document.cookie.indexOf(";", document.cookie.indexOf(`${cookie}=`))
    let value
    if(end < start) {
        value = document.cookie.substring(start)
    } else {
        value = document.cookie.substring(start, end)
    }  
    console.log(value)
    return value
}