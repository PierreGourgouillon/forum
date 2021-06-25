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
    let value = valueOfCookie("PioutterMode")
    
    if(value === "D") {
        document.getElementById("modePage").textContent = "Mode Clair"
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