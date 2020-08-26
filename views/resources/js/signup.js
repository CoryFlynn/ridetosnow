function getDriverInfo(id, toggle){
    if(toggle == 0){
        document.getElementById(id).style.height = "0px";
        document.getElementById(id).style.visibility = "hidden";
    }
    else {
        document.getElementById(id).style.height = "50px";
        document.getElementById(id).style.visibility = "visible";
    }
}