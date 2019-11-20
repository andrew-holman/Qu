function showOptions(join){
    if(join){
        document.getElementById("EnterCode").style.visibility = "visible"
        document.getElementById("enterCode").style.visibility = "visible"
        document.getElementById("joinClass").style.visibility = "visible"

    }
    else{
        document.getElementById("EnterCode").style.visibility = "hidden"
        document.getElementById("enterCode").style.visibility = "hidden"
        document.getElementById("joinClass").style.visibility = "hidden"

        while(true){
            var userID = prompt("What is your email?")
            $.ajax({
                type: "POST",
                data: {userName: userID},
                dataType: "json",
                url: "http://localhost:8080/demo/user/get/userName",
                crossDomain: true,
                success: function (data, status) {
                    console.log("Data " + JSON.stringify(data));
                    if(data.displayName == "User doesn't exist"){
                        alert("Email not found, please try again");
                        continue
                    }
                    else {
                        createClass(userID, data.displayName)
                        setClassID()
                        break
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
            if(data.classId === -1){
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
                window.alert("Error: Could not find class session with code: " + classID)
            }
        },
        error: function (xhr,status,error) {
            console.log(status);
            console.log(error);
            console.log(xhr);
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
}

