var email = sessionStorage.getItem("Email")
var displayName = sessionStorage.getItem("DisplayName")
var classId = sessionStorage.getItem("classID")
var isCreator = sessionStorage.getItem("creator")
var className = sessionStorage.getItem("className")
var completedQueries = []
var webSocket
document.getElementById("showName").innerHTML = "Welcome to " + sessionStorage.getItem("className")
document.getElementById("h2").innerHTML = classId + ""

document.addEventListener("DOMContentLoaded", function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});

document.getElementById("addRow").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryType").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryTypeText").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryText").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryType").style .visibility = isCreator ? "hidden" : "visible"
document.getElementById("removeSelected").style .visibility = true/*isCreator*/ ? "visible" : "hidden"
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
        $.ajax({
            type: "POST",
            data: {classId: classId},
            dataType: "text",
            url: "http://localhost:8080/class/query/view",
            crossDomain: true,
            success: function(data){
                console.log("Successful query retrieval.");
                for(var i = 0; i < data.length; i++){
                    var newItem = createNewRowData(data[i].displayName, data[i].queryType, data[i].queryString, data[i].queryId)
                    gridOptions.api.updateRowData({add: [newItem]});
                }
                console.log(rowData)
            },
            error: function(){
                console.log("Failed to retrieve query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    };
    webSocket.onmessage = function (event){
        $.ajax({
            type: "POST",
            data: {classId: classId},
            dataType: "text",
            url: "http://localhost:8080/class/query/view",
            crossDomain: true,
            success: function(data){
                console.log("Successful query retrieval.");
                gridOptions.api.setRowData([])
                for(var i = 0; i < data.length; i++){
                    var newItem = createNewRowData(data[i].displayName, data[i].queryType, data[i].queryString, data[i].queryId)
                    gridOptions.api.updateRowData({add: [newItem]});
                }
                updateRowDataClient()
                console.log(rowData)
            },
            error: function(){
                console.log("Failed to retrieve query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
    };
    webSocket.onerror = function(event){
        console.log(event.data);
    }
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
               // console.log(rowData)
            },
            error: function(){
                console.log("Failed to post query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
       
        autoSizeAll()
    }
    var newItem = createNewRowData("P", questionType, question, 122)
    gridOptions.api.updateRowData({add: [newItem]});
    clearEntries()
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
            gridOptions.api.updateRowData({remove: selectedData});
        }
        else{
            console.log(selectedData)
            gridOptions.api.updateRowData({remove: selectedData});
        }
    }
    gridOptions.api.updateRowData({remove: selectedData});
    updateRowDataClient()
    console.log(rowData + "HEllo")
    console.log(rowData.length)
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
    webSocket.send("Updating users")
    console.log(rowData)
}

function updateRowDataClient(){
   // console.log(rowData)
    var temp = []
    for(var i = 0; i < rowData.length; i++){
        try{
            var rowNode = gridOptions.api.getDisplayedRowAtIndex(i)
            temp.push({name: rowNode.data.name, type: rowNode.data.type, description: rowNode.data.description, id: rowNode.data.id})
        }catch(e){
            rowData = []
        }
        
    }
    rowData = temp
}

function clearEntries(){
    document.getElementById("queryTypeText").value = ""
    document.getElementById("queryMessage").value = ""
}