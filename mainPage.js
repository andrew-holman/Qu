function showOptions(join){
    if(join){
        document.getElementById("EnterCode").style.visibility = "visible"
        document.getElementById("enterCode").style.visibility = "visible"
        document.getElementById("joinClass").style.visibility = "visible"

    }
    else{
        document.getElementById("EnterCode").style.visibility = "hidden"
        document.getElementById("enterCode").style.visibility = "hidden"
        document.getElementById("joinClass").style.visibility = "hidden"

    }
}