function displayFields(rCheck){
    if(rCheck){
        document.getElementById("EmailR").style.visibility = "visible"
        document.getElementById("emailR").style.visibility = "visible"
        document.getElementById("PasswordR").style.visibility = "visible"
        document.getElementById("passwordR").style.visibility = "visible"
        document.getElementById("PassCode").style.visibility = "visible"
        document.getElementById("passCode").style.visibility = "visible"
        document.getElementById("vPass").style.visibility = "visible"
        document.getElementById("emailSend").style.visibility = "hidden"
        
        
}
    else{
        document.getElementById("PasswordR").style.visibility = "hidden"
        document.getElementById("passwordR").style.visibility = "hidden"
        document.getElementById("PassCode").style.visibility = "hidden"
        document.getElementById("passCode").style.visibility = "hidden"
        document.getElementById("vPass").style.visibility = "hidden"

        document.getElementById("emailSend").style.visibility = "visible"
        document.getElementById("EmailR").style.visibility = "visible"
        document.getElementById("emailR").style.visibility = "visible"
    }
}

function sendEmail(){
    var email = document.getElementById("emailR").value
    var emailAlert = validateEmail(email)
    if(emailAlert === ""){
        $.ajax({
            type: "POST",
            data: {userName: email},
            dataType: "text",
            url: "http://localhost:8080/demo/user/resetPassword",
            crossDomain: true,
            success: function (data, status) {
                console.log("Data " + JSON.stringify(data));
                alert("Please check your email for a password reset code")
            },
            error: function (xhr,status,error) {
                console.log(status);
                console.log(error);
                console.log(xhr);
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    }
    else alert(emailAlert)
}

function verifyPassword(){
    var email = document.getElementById("emailR").value
    var password = document.getElementById("passwordR").value
    var code = document.getElementById("passCode").value
    var emailAlert = validateEmail(email)
    var passAlert = validatePassword(password)
    if(emailAlert === "" && passAlert === ""){
        $.ajax({
            type: "POST",
            data: {userName: email, newPassword: password, code: code},
            dataType: "text",
            url: "http://localhost:8080/demo/user/checkPasswordReset",
            crossDomain: true,
            success: function (data, status) {
                console.log("Data " + JSON.stringify(data));
                if(data === "Success"){
                    alert("Your password has been reset")
                }
                else{
                    alert("Failed to reset your password");
                }
            },
            error: function (xhr,status,error) {
                console.log(status);
                console.log(error);
                console.log(xhr);
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    }
    else alert(emailAlert + "\n" + passAlert)
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