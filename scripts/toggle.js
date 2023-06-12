function onLoad(){
    var upCarets = document.querySelectorAll(".bi-caret-up");
    upCarets.forEach(hide);
}

function hide(elem) {
    elem.style.display = "none";
}

function toggleShow(element){
    //Toggle between "show less" and "show more"
    if(element.childNodes[1].style.display != "none"){
        element.childNodes[1].style.display = "none";
        element.childNodes[0].nodeValue = "Show Less \n";
        element.childNodes[3].style.display = "inline";
    } else {
        element.childNodes[1].style.display = "inline";
        element.childNodes[0].nodeValue = "Show More \n";
        element.childNodes[3].style.display = "none";
    }
}