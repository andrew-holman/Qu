document.getElementById("showName").innerHTML = "Welcome to " + sessionStorage.getItem("className")
var email = sessionStorage.getItem("Email")
var displayName = sessionStorage.getItem("DisplayName")
var classId = sessionStorage.getItem("classID")
console.log("CLass ID: " + classId);
var isCreator = sessionStorage.getItem("creator") === "TRUE";
var className = sessionStorage.getItem("className")
var completedQueries = []
var webSocket;
document.getElementById("showId").innerHTML = classId + "";
document.getElementById("showName").innerHTML = className + "";


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
createConnection();

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
    console.log("HELLO" + sessionStorage.getItem("creator"));
    console.log(sessionStorage.getItem("Hello"));

    webSocket = new WebSocket("ws://localhost:8080/socket");
    webSocket.binaryType = "arraybuffer";
    console.log(webSocket.OPEN);

    webSocket.onopen = function (event) {
        webSocket.send("");
        $.ajax({
            type: "POST",
            data: {classId: classId},
            dataType: "json",
            url: "http://localhost:8080/class/query/view",
            crossDomain: true,
            success: function(data, status){
                console.log(data);
                console.log("Got query list.");
                for(let i = 0; i < data.length; i++){
                    var rowInfo = createNewRowData(data[i].displayName, data[i].queryType, data[i].queryString, data[i].queryId);
                    gridOptions.api.updateRowData({add: [rowInfo]});
                }
                //gridOptions.api.updateRowData(data);
                updateRowDataClient();
                console.log("Updated");
            },
            error: function(){
                console.log("Failed to get query list.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));

        //rowData[i].type + "." + rowData[i].name + "." + rowData[i].description + "." + rowData[i].id
    };
    webSocket.onmessage = function (event){
        console.log(event.data);

        $.ajax({
            type: "POST",
            data: {classId: classId},
            dataType: "json",
            url: "http://localhost:8080/class/query/view",
            crossDomain: true,
            success: function(data, status){
                console.log(data);

                gridOptions.api.setRowData([]);
                console.log("Row Data: " + rowData)
                for(let i = 0; i < data.length; i++){
                    let rowInfo = createNewRowData(data[i].displayName, data[i].queryType, data[i].queryString, data[i].queryId);
                    gridOptions.api.updateRowData({add: [rowInfo]});
                }
                //gridOptions.api.updateRowData(data);
                updateRowDataClient();
                console.log("Updated");
            },
            error: function(){
                console.log("Failed to get query list.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
        
    };
    webSocket.onerror = function(event){
        console.log(event.data);
    };
    webSocket.onclose = function (event){
        console.log ("Socket Closed: " + event.data);
    };
}

function onClickAdd(){
    let messageInput = document.getElementById("queryMessage").value;
    let typeInput = document.getElementById("queryTypeText").value;
    $.ajax({
        type: "POST",
        data: {classId: classId, queryString: messageInput, queryType: typeInput, userName: email, displayName: displayName},
        dataType: "text",
        url: "http://localhost:8080/class/query/add",
        crossDomain: true,
        success: function(){
            webSocket.send("Function has been updated");
            console.log("Successful query post.");
        },
        error: function(){
            console.log("Failed to post query.");
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));

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