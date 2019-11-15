
function displayFields(guest){
    if(guest){
        document.getElementById("loginUser").style.visibility = "hidden"
        document.getElementById("email").style.visibility = "hidden"
        document.getElementById("password").style.visibility = "hidden"
        document.getElementById("Email").style.visibility = "hidden"
        document.getElementById("Password").style.visibility = "hidden"
        
        document.getElementById("guestName").style.visibility = "visible"
        document.getElementById("GuestName").style.visibility = "visible"
}
    else{
        document.getElementById("guestName").style.visibility = "hidden"
        document.getElementById("GuestName").style.visibility = "hidden"

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

    console.log(password);
    $.ajax({
        type: "POST",
        data: {userName: email, userPassword: password},
        dataType: "json",
        url: "http://localhost:8080/demo/user/login",
        crossDomain: true,
        success: function (data, status) {
            console.log("Data " + JSON.stringify(data));
            if(data.userId === -1){
                alert("Incorrect Login Information");
            }
            else{
                main();
            }
        },
        error: function (xhr,status,error) {
            console.log(status);
            console.log(error);
            console.log(xhr);
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));

   /*var x =$.getJSON("/user/login" + email + "/" + password, function(data){})
        Using this function, we will receive
        a JSON object from the server and the
        object will contain a parameter called userID.
        userID will be a number and if that
        number is -1, then the front end will
        know that there was an error logging
        in. The front end can then display that
        error by displaying the displayName from
        the JSON object since that is where it will
        be contained.
   */
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
