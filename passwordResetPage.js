function vPass(){
    var email = document.getElementById("emailR")
    var password = document.getElementById("passwordR")
    var code = document.getElementById("passCode")
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