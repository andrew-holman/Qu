document.getElementById("showName").innerHTML = "Welcome to " + sessionStorage.getItem("className")
document.getElementById("h1").innerHTML = classId + ""
var email = sessionStorage.getItem("Email")
var displayName = sessionStorage.getItem("DisplayName")
var classId = sessionStorage.getItem("classID")
var isCreator = sessionStorage.getItem("creator")
var className = sessionStorage.getItem("className")
var completedQueries = []
var webSocket

document.addEventListener("DOMContentLoaded", function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});

document.getElementById("addRow").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryType").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryTypeText").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryText").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryType").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("removeSelected").style .visibility = isCreator ? "visible" : "hidden"
document.getElementById("complete").style .visibility = isCreator ? "visible" : "hidden"


var columnDefs = [
    {field: "Name", field: "name", rowDrag: isCreator},
    {field: "Type", field: "type"},
    {field: "Description", field: "description", resizable: true}
];

var rowData = [];

var gridOptions = {
    rowDragManaged: isCreator,
    columnDefs: columnDefs,
    animateRows: true,
    rowSelection: 'multiple',
    rowData: rowData,
    domLayout: 'autoHeight',
    pagination: false,
    onRowDragEnd: onRowDragEnd,
};

function createConnection(){
    webSocket = new WebSocket("wss://www.example.com/socketserver", "protocolOne");
    webSocket.onopen = function (event) {
        webSocket.send("newConnection." + email);
        //rowData[i].type + "." + rowData[i].name + "." + rowData[i].description + "." + rowData[i].id
    };
    webSocket.onmessage = function (event){
        console.log(event.data);
        var messageDecode = event.data.split(".")
        if(messageDecode[0] == "Update"){
            gridOptions.api.updateRowData({remove: rowData});
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

function createNewRowData(name, type, description, id) {
    var newData = {
        name: name,
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
                var newItem = createNewRowData(nameToDisplay, questionType, question, data.queryId)
                gridOptions.api.updateRowData({add: [newItem]});
                clearEntries()
                console.log(rowData)
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
    var successfulDeletion = false
    
    for(var i = 0; i < selectedData.length; i++){
        $.ajax({
            type: "POST",
            data: {classId: classId, queryId: selectedData[i].id},
            dataType: "text",
            url: "http://localhost:8080/class/query/delete",
            crossDomain: true,
            success: function(){
                successfulDeletion = true
                console.log("Successful query removal.");
            },
            error: function(){
                successfulDeletion = false
                console.log("Failed to delete query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    }
    if(successfulDeletion){
        if(completed){
            for(var i = 0; i < selectedData.length; i++) {
                completedQueries.push(selectedData[i])
            }
            console.log(completedQueries)
            var res = gridOptions.api.updateRowData({remove: selectedData});
        }
        else{
            console.log(selectedData)
            var res = gridOptions.api.updateRowData({remove: selectedData});
        }
        updateRowDataClient()
        var stringToSend = buildStringToSend()
        webSocket.send(stringToSend)
    }
}

function autoSizeAll() {
    var allColumnIds = [];
    gridOptions.columnApi.getAllColumns().forEach(function(column) {
        allColumnIds.push(column.colId);
    });
    gridOptions.columnApi.autoSizeColumns(allColumnIds);
}

function onRowDragEnd(e) {
    console.log(rowData)
    updateRowDataClient()
    var string = buildStringToSend()
    webSocket.send(string)
    console.log(rowData)
}

function updateRowDataClient(){
    var temp = []
    for(var i = 0; i < rowData.length; i++){
        var rowNode = gridOptions.api.getDisplayedRowAtIndex(i)
        temp.push({name: rowNode.data.name, type: rowNode.data.type, description: rowNode.data.description, id: rowNode.data.id})
    }
    rowData = temp
}

function clearEntries(){
    document.getElementById("queryTypeText").innerHTML = ""
    document.getElementById("queryMessage").innerHTML = ""
}