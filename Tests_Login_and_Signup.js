testsToRun()
function testsToRun(){
    var assert = require("assert")
    var shortPass = "toShort"
    var invPasswords = ["testPass123", "TESTPASS123", "testpass123", "testPass!@#"]
    var valPass = "passPass123!"

    var valName = "Patrick Wenzel"
    var invNames = ["Patrick12", "Andrew?"]

    var invEmail = ["pwenzeliastate.edu", "pwenzel@iastateedu", "aholmaniastateedu", "aholman?@iastate.edu", "pwenzel@", "@iastate", "@iastate."]
    var validEmail = "pwenzel@iastate.edu"

    var notMatchPass = "Test123123!"
    var matchPass = "passPass123!"

    console.assert(validatePassword(shortPass) != "", validatePassword(shortPass))
    for(var i = 0; i < invPasswords.length; i++){
        console.assert(validatePassword(invPasswords[i]) != "", validatePassword(invPasswords[i]))
    }
    console.assert(validatePassword(valPass) == "", "Passed")
    console.assert(validateName(valName) == "", "Invalid Name")
    for(var i = 0; i < invNames; i++){
        console.assert(validateName(invNames[i]) != "", "Invalid Name")
    }
    for(var i = 0; i < invEmail.length; i++){
        console.assert(validateEmail(invEmail[i]) != "", invEmail[i])
    }
    console.assert(validateEmail(validEmail) == "", "Invalid Email")
    console.assert(confirmPassword(valPass, notMatchPass, true) != "", "Password didn't match")
    console.assert(confirmPassword(valPass, matchPass, true) == "", "Password didn't match")
}


function validateName(name){
    if(name == "") return "name cannot be empty!"
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