
function displayFields(guest){
    if(guest){
        document.getElementById("loginUser").style.visibility = "hidden"
        document.getElementById("email").style.visibility = "hidden"
        document.getElementById("password").style.visibility = "hidden"
        document.getElementById("Email").style.visibility = "hidden"
        document.getElementById("Password").style.visibility = "hidden"


}
    else{


        document.getElementById("loginUser").style.visibility = "visible"
        document.getElementById("email").style.visibility = "visible"
        document.getElementById("password").style.visibility = "visible"
        document.getElementById("Email").style.visibility = "visible"
        document.getElementById("Password").style.visibility = "visible"
    }
}

function signInGuest(){
    var x =$.getJSON("/all", function(data){
        if (data != null) {
            for(key in data){
                console.log(key +"\n")
            }
          }
    })
}
function signInUser(){

    var email = document.getElementById('email').value
    var emailTag = validateEmail(email);
    var emailCheck = emailTag === ""

    var password = document.getElementById('password').value
    var passwordTag = validatePassword(password)
    var passwordCheck = passwordTag === ""

    var alertMessage = ""
    alertMessage += emailCheck ? "" : emailTag +"\n"
    alertMessage += passwordCheck ? "" : passwordTag

    // $.getJSON("127.0.0.1:8080/demo/all", function (data) {
    //     console.log("HERE")
    //     console.log(data);
    //     if (data != null) {
    //         for (let key in data) {
    //             console.log(data);
    //         }
    //     }
    // }).then(r => console.log("Finished")).fail(r => console.log("FAILED")).then(r => console.log("Fail completed")) ;
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        url: "http://localhost:8080/demo/all",
        success: function (data, status) {
            console.log("FOUND");
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail"));

      if(alertMessage === ""){
        document.getElementById('password').value = ""
        document.getElementById('email').value = ""
        window.alert("Successful")
    }
    else window.alert(alertMessage)

    // var xmlhttp = new XMLHttpRequest()
    // xmlhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //       var myObj = JSON.parse(this.responseText);
    //     }
    //   };
    // xmlhttp.open("GET", "")
    // xmlhttp.send()
}

function validateEmail(givenEmail) {
    if(givenEmail == "") return "Email cannot be empty!"
    var alphanumeric = /^[A-za-z0-9.]+$/i;
    atSymbolSplit = givenEmail.split('@');
    if ((atSymbolSplit[0]).match(alphanumeric) && atSymbolSplit.length == 2) {
        periodSplit = atSymbolSplit[1].split('.')
        if ((periodSplit[0] + periodSplit[1]).match(alphanumeric) && periodSplit.length == 2) return "";
    }
    return "Invalid email, must be in the format abc@abc.abc"
}

function validatePassword(password){
    var alpha = /[A-Za-z]/i;
    var numer = /[0-9]/;
    var special = /[!@#$%^&*(),.?;":{}|<>']/;
    if(password === "") return "Password cannot be empty!";
    if(password.length < 8) return "Password must be at least 8 characters";
    if(!(password.match(alpha) && password.match(numer) && password.match(special))) return "Password must contain alphabetic, numeric, and a special character"
    return ""
}