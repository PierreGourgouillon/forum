/*function hiddenDiv(){
    let hidden = document.getElementById('container-filter');
    if(hidden.style.visibility === 'hidden'){
        hidden.style.height = 'auto';
        hidden.style.visibility = 'visible';
        let img = document.getElementById('filter-img');
        img.src = img.src.replace('_down', '_up');
    }else if (hidden.style.visibility === 'visible'){
        let img = document.getElementById('filter-img');
        img.src = img.src.replace('_up', '_down');
        hidden.style.visibility = 'hidden'
        hidden.style.height = '0px'
    }else{
        console.log(hidden.style.visibility)
    }
};*/

function popup(){
    document.getElementById("pop-up").style.display = "block";
}