var count = 0;
function test(){
    if(count == 0){
        count = 1
        document.getElementById("showName").style.color = 'red'
    }
    else{
        count = 0;
        document.getElementById("showName").style.color = "#FFFFFF"
    }
}
