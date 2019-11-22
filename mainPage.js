function showOptions(join){
    if(join){
        document.getElementById("EnterCode").style.visibility = "visible"
        document.getElementById("enterCode").style.visibility = "visible"
        document.getElementById("joinClass").style.visibility = "visible"
        document.getElementById("EnterEmail").style.visibility = "visible"
        document.getElementById("enterEmail").style.visibility = "visible"

        document.getElementById("createAClass").style.visibility = "hidden"
    }
    else{
        document.getElementById("EnterCode").style.visibility = "hidden"
        document.getElementById("enterCode").style.visibility = "hidden"
        document.getElementById("joinClass").style.visibility = "hidden"
        

        document.getElementById("EnterEmail").style.visibility = "visible"
        document.getElementById("enterEmail").style.visibility = "visible"
        document.getElementById("createAClass").style.visibility = "visible"
        //getUserID()
        
    }
}

function join(){
    var email = document.getElementById('enterEmail').value
    var code = parseInt(document.getElementById('enterCode').value)
    joinClass(email, code)
  }
  function joinOrCreate(){
    if(document.getElementById("enterCode").style.visibility == "hidden")getUserID()
    else joinClass(document.getElementById("enterEmail").value , document.getElementById("enterCode").value)
  }

function getUserID(){
    // $.ajax({
    //     type: "POST",
    //     data: {userName: userID},
    //     dataType: "json",
    //     url: "http://localhost:8080/demo/user/get/userName",
    //     crossDomain: true,
    //     success: function (data, status) {
    //         console.log("Data " + JSON.stringify(data));
    //         if(data.displayName == "User doesn't exist"){
    //             console.log("Email not found, please try again");
                
    //         }
    //         else {
    //             createClass(userID, data.displayName)
    //             break
    //         }
    //     },
    //     error: function (xhr,status,error) {
    //         console.log(status);
    //         console.log(error);
    //         console.log(xhr);
    //     },
    // }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    grid();
}

function createClass(userID, displayName){
    $.ajax({
        type: "POST",
        data: {creatorUserName: userID, displayName: displayName},
        dataType: "json",
        url: "http://localhost:8080/class/add",
        crossDomain: true,
        success: function (data, status) {
            console.log("Data " + JSON.stringify(data));
            if(data.displayName == "Failed to create a class"){
                alert("Error creating class! Please try again");
                
            }
            else {
                joinClass(userID, data.classID)
            }
        },
        error: function (xhr,status,error) {
            console.log(status);
            console.log(error);
            console.log(xhr);
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
}

function joinClass(email, classID){
    console.log(email + " " + classID)
    $.ajax({
        type: "POST",
        data: {userName: email, classId: classID},
        dataType: "json",
        url: "http://localhost:8080/demo/user/set/classId",
        crossDomain: true,
        success: function (data, status) {
            console.log("Data " + JSON.stringify(data));
            if(data == "Id changed"){
                //Successful
            }
            else if(data == "No such user in database"){
                window.alert("Error: Could not find username")
            }
            else{
                window.alert("Error: Could not find class session with code " + classID)
            }
        },
        error: function (xhr,status,error) {
            console.log(status);
            console.log(error);
            console.log(xhr);
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
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