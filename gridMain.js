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
    {field: "Type", field: "type", filter: isCreator},
    {field: "Description", field: "description", resizable: true}
];

var rowData = [
    {name: "Andrew Holman", type: "Demo", description: "I would like to demo for Iteration 2"},
    {name: "Patrick Wenzel", type: "Question", description: "For part 2 of the lab, how do I get started?"},
    {name: "Luke", type: "Error", description: "I am getting a 400 error and I am not sure why"},
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
        //rowData[i].type + "." + rowData[i].name + "." + rowData[i].description
    };
    webSocket.onmessage = function (event){
        console.log(event.data);
        //TODO Message Checking
        var messageDecode = event.data.split(".")
        if(messageDecode[0] == "Update"){
            //TODO Delete all rows
            var res = gridOptions.api.updateRowData({remove: rowData});
            for(var i = 1; i + 2 <= messageDecode.length ; i += 3){
                onAddRow(messageDecode[i], messageDecode[i + 1], messageDecode[i + 2], true)
            }
            var stringToSend = buildStringToSend();
        }
        else if((messageDecode[0] == "newConnection") && isCreator){
            var stringToSend = buildStringToSend();
            //TODO Send string
        }
        
    };
    webSocket.onerror = function(event){
        console.log(event.data);
    }
}

function buildStringToSend(){
    var stringToSend = "Update."
        for(var i = 0; i < rowData.length; i++){
            stringToSend += rowData[i].type + "." + rowData[i].name + "." + rowData[i].description
        }
    return stringToSend
}

function createNewRowData(type, description) {
    var newData = {
        name: displayName,
        type: type,
        description: description,
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
        var newItem = createNewRowData(questionType, question);
        var res = gridOptions.api.updateRowData({add: [newItem]});
        $.ajax({
            type: "POST",
            data: {classId: classId, queryString: question, queryType: questionType, userName: email, displayName: nameToDisplay},
            dataType: "text",
            url: "http://localhost:8080/class/query/add",
            crossDomain: true,
            success: function(){
                console.log("Successful query post.");
            },
            error: function(){
                console.log("Failed to post query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
        autoSizeAll()
    }
    console.log(rowData)
    var stringToSend = buildStringToSend()
    //TODO Send update string
}

function onRemoveSelected(completed) {
    if(completed){
        var selectedData = gridOptions.api.getSelectedRows();
        for(var i = 0; i < selectedData.length; i++) {
            completed.push(selectedData[i])
        }
        console.log(completed)
        var res = gridOptions.api.updateRowData({remove: selectedData});
    }
    else{
        var selectedData = gridOptions.api.getSelectedRows();
        console.log(selectedData)
        var res = gridOptions.api.updateRowData({remove: selectedData});
    }
    var stringToSend = buildStringToSend()
    //TODO Send update string
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
