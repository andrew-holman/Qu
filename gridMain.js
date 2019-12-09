var className = sessionStorage.getItem("className")
document.getElementById("showName").innerHTML = "Welcome to " + className
var email = sessionStorage.getItem("Email")
var displayName = sessionStorage.getItem("DisplayName")
var classId = sessionStorage.getItem("classID")
var isCreator = sessionStorage.getItem("creator")
var className = sessionStorage.getItem("className")
var completed = []
var webSocket

var columnDefs = [
    {field: "Name", field: "name", rowDrag: isCreator},
    {field: "Type", field: "type", filter: false},
    {field: "Description", field: "description", resizable: true}
];

var rowData = [
    {name: "Andrew Holman", type: "Demo", description: "I would like to demo for Iteration 2", id: "aa"},
    {name: "Patrick Wenzel", type: "Question", description: "For part 2 of the lab, how do I get started?", id: "bb"},
    {name: "Luke", type: "Error", description: "I am getting a 400 error and I am not sure why", id: "cc"},
];

var gridOptions = {
    rowDragManaged: isCreator,
    columnDefs: columnDefs,
    animateRows: true,
    rowSelection: 'multiple',
    rowData: rowData,
    domLayout: 'autoHeight',
    pagination: false
};

function createConnection(){
    webSocket = new WebSocket("wss://www.example.com/socketserver", "protocolOne");
    webSocket.onopen = function (event) {
        webSocket.send("newConnection." + email);
        //rowData[i].type + "." + rowData[i].name + "." + rowData[i].description + "." + rowData[i].id
    };
    webSocket.onmessage = function (event){
        console.log(event.data);
        //TODO Message Checking
        var messageDecode = event.data.split(".")
        if(messageDecode[0] == "Update"){
            //TODO Delete all rows
            var res = gridOptions.api.updateRowData({remove: rowData});
            for(var i = 1; i + 3 <= messageDecode.length ; i += 4){
                onAddRow(messageDecode[i], messageDecode[i + 1], messageDecode[i + 2], true)
            }
            var stringToSend = buildStringToSend();
            webSocket.send(stringToSend)
        }
        else if((messageDecode[0] == "newConnection") && isCreator){
            var stringToSend = buildStringToSend();
            webSocket.send(stringToSend)
        }
        
    };
    webSocket.onerror = function(event){
        console.log(event.data);
    }
}

function buildStringToSend(){
    var stringToSend = "Update."
        for(var i = 0; i < rowData.length; i++){
            stringToSend += rowData[i].type + "." + rowData[i].name + "." + rowData[i].description + "." + rowData[i].id
        }
    return stringToSend
}

function createNewRowData(type, description, id) {
    var newData = {
        name: displayName,
        type: type,
        description: description,
        id: id,
    };
    rowData.push(newData)
    return newData;
}

function onAddRow(receivedType, receivedQuery, receivedName, received) {

    var questionType = received ? receivedType : document.getElementById("queryTypeText").value
    var question = received ? receivedQuery : document.getElementById("queryMessage").value
    var empty = (question === "") || (questionType === "")
    var nameToDisplay = received ? receivedName : displayName
    if(empty) alert("Question type not specified and/or question not entered")
    else{
        $.ajax({
            type: "POST",
            data: {classId: classId, queryString: question, queryType: questionType, userName: email, displayName: nameToDisplay},
            dataType: "text",
            url: "http://localhost:8080/class/query/add",
            crossDomain: true,
            success: function(data){
                console.log("Successful query post.");
                var newItem = createNewRowData(questionType, question, data.queryId);
                rowData.push(newItem)
                var res = gridOptions.api.updateRowData({add: [newItem]});
            },
            error: function(){
                console.log("Failed to post query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
       
        autoSizeAll()
    }
    console.log(rowData)
    var stringToSend = buildStringToSend()
    webSocket.send(stringToSend)
}

function onRemoveSelected(completed) {
    var selectedData = gridOptions.api.getSelectedRows();
    if(completed){
        for(var i = 0; i < selectedData.length; i++) {
            completed.push(selectedData[i])
        }
        console.log(completed)
        var res = gridOptions.api.updateRowData({remove: selectedData});
    }
    else{
        console.log(selectedData)
        var res = gridOptions.api.updateRowData({remove: selectedData});
    }
    var stringToSend = buildStringToSend()
    webSocket.send(stringToSend)
    for(var i = 0; i < selectedData.length; i++){
        $.ajax({
            type: "POST",
            data: {classId: classId, queryId: selectedData[i].id},
            dataType: "text",
            url: "http://localhost:8080/class/query/delete",
            crossDomain: true,
            success: function(){
                console.log("Successful query removal.");
            },
            error: function(){
                console.log("Failed to delete query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    }
}

function complete(){
    onRemoveSelected(true)
}

function autoSizeAll() {
    var allColumnIds = [];
    gridOptions.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId);
    });
    gridOptions.columnApi.autoSizeColumns(allColumnIds);
}

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    // var httpRequest = new XMLHttpRequest();
    // httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json');
    // httpRequest.send();
    // httpRequest.onreadystatechange = function() {
    //     if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    //         var httpResult = JSON.parse(httpRequest.responseText);
    //         gridOptions.api.setRowData(httpResult);
    //     }
    // };
});
