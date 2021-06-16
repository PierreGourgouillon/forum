document.addEventListener("DOMContentLoaded", chargeMode)
document.addEventListener("DOMContentLoaded", () => document.getElementById("mode").addEventListener("click", changeMode))

function changeMode() {
    let value = valueOfCookie("PioutterMode")
    
    if(value === "L") {
        document.cookie = "PioutterMode=D; path=/"
    } else if(value === "D") {
        document.cookie = "PioutterMode=L; path=/"
    } else {
        document.cookie = "PioutterMode=L; path=/"        
    }

    document.location.reload()
}

function chargeMode() {
    let head = document.head
    let css = head.querySelectorAll("link")
    let value = valueOfCookie("PioutterMode")
    
    if(value == "L") {
        console.log("eho")
    } else if(value === "D") {
        const regEx = new RegExp("LightMode", "g")
        css.forEach((elem, i) => {
            console.log(i)
            elem.href = elem.href.replace(regEx, "DarkMode")
        })
        document.getElementById("modePage").textContent = "Mode Clair"
    } else {
        document.cookie = "PioutterMode=L; path=/"
        document.location.reload()
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