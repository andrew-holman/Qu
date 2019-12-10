function showOptions(join){
    if(join){
        console.log(sessionStorage.getItem("user"));
        document.getElementById("EnterCode").style.visibility = "visible"
        document.getElementById("enterCode").style.visibility = "visible"
        document.getElementById("joinClass").style.visibility = "visible"
        document.getElementById("EnterClass").style.visibility = "hidden"
        document.getElementById("enterClass").style.visibility = "hidden"

        document.getElementById("createAClass").style.visibility = "hidden"
    }
    else{
        document.getElementById("EnterCode").style.visibility = "hidden"
        document.getElementById("enterCode").style.visibility = "hidden"
        document.getElementById("joinClass").style.visibility = "hidden"
        

        document.getElementById("EnterClass").style.visibility = "visible"
        document.getElementById("enterClass").style.visibility = "visible"
        document.getElementById("createAClass").style.visibility = "visible"
        //getUserID()
        
    }
}

var userEmail = sessionStorage.getItem("email")
var displayName = sessionStorage.getItem("displayName")
var creator = false
var className = ""

function join(){
    var code = parseInt(document.getElementById('enterCode').value)
    joinClass(userEmail, code)
}

function joinOrCreate(){
    //if(document.getElementById("enterCode").style.visibility == "hidden")getUserID()
    //else joinClass(userEmail, document.getElementById("enterCode").value)
    getUserID();
}

function getUserID(){
    className = document.getElementById("enterClass").value;
    createClass(userEmail, className);
}

function createClass(userID, displayName){
    creator = true
    $.ajax({
        type: "POST",
        data: {creatorUserName: userID, displayName: displayName},
        dataType: "text",
        async: true,
        url: "http://localhost:8080/class/add",
        crossDomain: true,
        success: function (data, status) {
            console.log("Data " + data);
            if(data.displayName === "Failed to create a class"){
                alert("Error creating class! Please try again");
                
            }
            else {
                joinClass(userID, JSON.parse(data).classId);
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
    console.log(email + " " + classID);
    $.ajax({
        type: "POST",
        data: {classId: classID},
        dataType: "json",
        async: true,
        url: "http://localhost:8080/class/get/id",
        crossDomain: true,
        success: function (data, status) {
            console.log("Data " + JSON.stringify(data));
            if(data.classId === -1 || data.classId === null){
                window.alert("Error: Could not find class session with code " + classID);
            }
            else{
                $.ajax({
                    type: "POST",
                    data: {userName: email, classId: classID},
                    dataType: "text",
                    async: true,
                    url: "http://localhost:8080/demo/user/set/classId",
                    crossDomain: true,
                    success: function (data, status) {
                        console.log("Data " + JSON.stringify(data));
                        if(data === "Id changed"){
                            sessionStorage.setItem("Hello", "HI");
                            sessionStorage.setItem("Email", email)
                            sessionStorage.setItem("DisplayName", displayName)
                            sessionStorage.setItem("classID", classID)
                            sessionStorage.setItem("creator", creator)
                            sessionStorage.setItem("className", className)
                            grid();
                        }
                        else if(data === "No such user in database"){
                            window.alert("Error: Could not find username")
                        }
                    },
                    error: function (xhr,status,error) {
                        console.log(status);
                        console.log(error);
                        console.log(xhr);
                    },
                }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
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
    if(givenEmail === "") return "Email cannot be empty!"
    var alphanumeric = /^[A-za-z0-9.]+$/i;
    atSymbolSplit = givenEmail.split('@');
    if ((atSymbolSplit[0]).match(alphanumeric) && atSymbolSplit.length === 2) {
        periodSplit = atSymbolSplit[1].split('.')
        if ((periodSplit[0] + periodSplit[1]).match(alphanumeric) && periodSplit.length === 2) return "";
    }
    return "Invalid email, must be in the format abc@abc.abc"
}