var emailValue;

function createUser(){
    var firstName = document.getElementById("firstName").value
    var firstNameTag = validateName(firstName)
    var firstNameCheck = firstNameTag == ""

    var lastName = document.getElementById("lastName").value
    var lastNameTag = validateName(lastName)
    var lastNameCheck = lastNameTag == ""

    var email = document.getElementById("email").value
    var emailTag = validateEmail(email)
    var emailCheck = emailTag == ""

    var password = document.getElementById("password").value
    var passwordTag = validatePassword(password)
    var passwordCheck = passwordTag == ""

    var passConf = document.getElementById("confirmpassword").value
    var passConfTag = confirmPassword(password, passConf, passwordCheck)
    var passConfCheck = passConfTag == ""

    var type = document.getElementsByName('userType');
    var typeSelected = isSelected(type)
    var typeSelectedCheck = typeSelected == ""
    
    var alertMessage = "" 
    alertMessage += firstNameCheck ? "" : "First " + firstNameTag +"\n"
    alertMessage += lastNameCheck ? "" : "Last " + lastNameTag + "\n"
    alertMessage += emailCheck ? "" : emailTag + "\n"
    alertMessage += passwordCheck ? "" : passwordTag + "\n"
    alertMessage += passConfCheck ? "" : passConfTag + "\n"
    alertMessage += typeSelectedCheck ? "" : typeSelected

    if(alertMessage === ""){
         $.ajax({
            type: "POST",
            data: {userName: email, displayName: firstName, userPassword: password},
            dataType: "text",
            url: "http://localhost:8080/demo/user/add",
            crossDomain: true,
            success: function (data, status) {
                console.log("Data " + JSON.stringify(data));
                emailValue = email;
                if (data === "Success") {
                   sendConfirmationEmail(email);
                    document.getElementById("ConfirmCode").style.visibility = "visible";
                    document.getElementById("confirmButton").style.visibility = "visible";
                    document.getElementById("FirstName").style.visiblity = "hidden";
                    document.getElementById("LastName").style.visiblity = "hidden";
                    document.getElementById("Email").style.visiblity = "hidden";
                    document.getElementById("Password").style.visiblity = "hidden";
                    document.getElementById("ConfirmPassword").style.visiblity = "hidden";
                    document.getElementById("Type").style.visiblity = "hidden";

                    clearEntries();
                } else {
                    alert("Failed to sign up");
                }
            },
            error: function (xhr,status,error) {
                console.log(status);
                console.log(error);
                console.log(xhr);
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    }
    else alert(alertMessage)
}

function sendConfirmationEmail(email){
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
function validateName(name){
    if(name == "") return "Name cannot be empty!"
    var r = /^[A-Za-z_ ]+$/;
    if (!name.match(r)) return "Invalid Name! Reminder, it can only be alphabetic characters."
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

function validatePassword(password){
    let alpha = /[A-Za-z]/i;
    let numer = /[0-9]/;
    let special = /[!@#$%\^&*(),\.?;":{}|<>\']/;
    if(password == "") return "Password cannot be empty!"
    if(password.length < 8) return "Password must be at least 8 characters"
    if(!(password.match(alpha) && password.match(numer) && password.match(special))) return "Password must contain alphabetic, numeric, and a special character"
    return ""
}

function confirmPassword(password, passConf, passCheck){
    if(!passCheck) return ""
    else return (passConf === password) ? "" : "Passwords must match!"
}

function isSelected(type){
    for(var i = 0; i < type.length; i++){
        if(type[i].checked) return ""
    }
    return "You must select whether you are a Student or an Instructor"
}

function clearEntries(){
    document.getElementById("firstName").value = ""
    document.getElementById("lastName").value = ""
    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("confirmpassword").value = ""
    document.getElementById("studentCheck").checked = false
    document.getElementById("instructorCheck").checked = false
}
function verifyButton(){
    let email = emailValue;
    let enteredCode = document.getElementById("confirm").value;
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
}