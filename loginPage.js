function displayFields(guest){
    if(guest){
        document.getElementById("loginUser").style.visibility = "hidden"
        document.getElementById("email").style.visibility = "hidden"
        document.getElementById("password").style.visibility = "hidden"
        document.getElementById("Email").style.visibility = "hidden"
        document.getElementById("Password").style.visibility = "hidden"
        
        document.getElementById("guestName").style.visibility = "visible"
        document.getElementById("GuestName").style.visibility = "visible"
        document.getElementById("loginGuest").style.visibility = "visible"
}
    else{
        document.getElementById("guestName").style.visibility = "hidden"
        document.getElementById("GuestName").style.visibility = "hidden"
        document.getElementById("loginGuest").style.visibility = "hidden"

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

    var password = document.getElementById('password').value;
    var passwordTag = validatePassword(password);
    var passwordCheck = passwordTag === "";

    var alertMessage = "";
    alertMessage += emailCheck ? "" : emailTag +"\n";
    alertMessage += passwordCheck ? "" : passwordTag;

    if(alertMessage === ""){
        $.ajax({
            type: "POST",
            data: {userName: email, userPassword: password},
            dataType: "json",
            url: "http://localhost:8080/demo/user/login",
            crossDomain: true,
            success: function (data, status) {
                console.log("Data " + JSON.stringify(data));
                let shouldEnd;
                if (data.userId === -1) {
                    alert("Incorrect Login Information");
                } else {
                    if (!data.enabled) {
                        if (!confirm('Your email has not been verified, would you like us to resend you an email?')) {
                            var enteredCode = prompt("Please enter the code you received:");
                            verifyCode(email, enteredCode,
                                function (data, status) {
                                    console.log("Data " + JSON.stringify(data));
                                    if(data === "Success"){
                                        main();
                                    }
                                    else if(data === "Failure"){
                                        if(confirm("That code did not match the one we sent you, would you use to resend the code")){
                                            sendEmail(email);
                                        }
                                    }
                                    else alert(data)
                                },
                                function (xhr,status,error) {
                                console.log(status);
                                console.log(error);
                                console.log(xhr);
                                });
                        } else {
                            sendEmail(data.userName)
                        }
                    } else {
                        sessionStorage.setItem("email", email)
                        sessionStorage.setItem("displayName", data.displayName)
                        main()
                    }
                }
            },
            error: function (xhr,status,error) {
                console.log(status);
                console.log(error);
                console.log(xhr);
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    }
}

function sendEmail(email){
    $.ajax({
        type: "POST",
        data: {userName: email},
        dataType: "text",
        url: "http://localhost:8080/demo/user/sendConfirmation",
        crossDomain: true,
        success: function (data, status) {
            console.log("Data " + JSON.stringify(data));
            alert("Please check your inbox for an email to verify your account")
        },
        error: function (xhr,status,error) {
            console.log(status);
            console.log(error);
            console.log(xhr);
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
}

function verifyCode(email, code, successCallback, errorCallback){
    $.ajax({
        type: "POST",
        data: {userName: email, code: code},
        dataType: "text",
        async: true,
        url: "http://localhost:8080/demo/user/checkConfirmation",
        crossDomain: true,
        success: successCallback,
        error: errorCallback,
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
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
function validateEmail(givenEmail) {
    if(givenEmail == "") return "Email cannot be empty!"
    let alphanumeric = /^[A-za-z0-9.]+$/i;
    atSymbolSplit = givenEmail.split('@');
    if ((atSymbolSplit[0]).match(alphanumeric) && atSymbolSplit.length == 2) {
        periodSplit = atSymbolSplit[1].split('.')
        if ((periodSplit[0] + periodSplit[1]).match(alphanumeric) && periodSplit.length == 2) return "";
    }
    return "Invalid email, must be in the format abc@abc.abc"
}
