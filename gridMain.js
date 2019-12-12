var email = sessionStorage.getItem("Email")
var displayName = sessionStorage.getItem("DisplayName")
var classId = sessionStorage.getItem("classID")
console.log("CLass ID: " + classId);
var isCreator = sessionStorage.getItem("creator") === "true";
var className = sessionStorage.getItem("className")
console.log("Class Display: " + className);
var completedQueries = []
var webSocket;
var moveQueryId;
var hasBeenMoved = false;
var showClassID = isCreator ? classId : ""
document.getElementById("showName").innerHTML = "Welcome to " + className;
 document.getElementById("showId").style.visibility = isCreator ? "visible" : "hidden";
 document.getElementById("showId").innerHTML = "Join Code: " + classId;


document.addEventListener("DOMContentLoaded", function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});

document.getElementById("addRow").style.visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryType").style.visibility = isCreator ? "hidden" : "visible"
document.getElementById("selectType").style.visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryText").style.visibility = isCreator ? "hidden" : "visible"
document.getElementById("queryMessage").style.visibility = isCreator ? "hidden" : "visible"
document.getElementById("removeSelected").style.visibility = isCreator ? "visible" : "hidden"
document.getElementById("end").style.visibility = isCreator ? "visible" : "hidden"

var columnDefs = [
    {field: "Name", field: "name", rowDrag: isCreator},
    {field: "Type", field: "type"},
    {field: "Description", field: "description", resizable: true}
];

var rowData = [{name: "Patrick", type: "p", description: "p", id: 21}];

var gridOptions = {
    deltaRowDataMode: isCreator,
    columnDefs: columnDefs,
    animateRows: true,
    rowSelection: 'multiple',
    rowData: rowData,
    domLayout: 'autoHeight',
    pagination: false,
    onRowDragMove: onRowDragMove,
    onRowDragEnd: onRowDragEnd,
    getRowNodeId: getRowNodeId,
    onGridReady: function onGridReady() {

        createConnection()
        rowData.forEach( function(data, index) {
            data.id = index;
        });
    }
};

function getRowNodeId(data) {
    return data.queryId
}

function createConnection(){
    console.log(isCreator);
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
                for(let i = data.length-1; i >= 0; i--){
                    var rowInfo = createNewRowData(data[i].displayName, data[i].queryType, data[i].queryString, data[i].queryId);
                    gridOptions.api.updateRowData({add: [rowInfo]});
                }
                console.log("Updated");

            },
            error: function(){
                console.log("Failed to get query list.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));

    };
    webSocket.onmessage = function (event){
        console.log(event.data);
        if(event.data === "Closing"){
            webSocket.close()
            if(!isCreator){
                gridOptions.api.setRowData([]);
                document.getElementById("showName").innerHTML = className + " has ended";
            }
        }
        else {
            $.ajax({
                type: "POST",
                data: {classId: classId},
                dataType: "json",
                url: "http://localhost:8080/class/query/view",
                crossDomain: true,
                success: function (data, status) {
                    console.log(data);

                    gridOptions.api.setRowData([]);
                    rowData = [];
                    console.log("Row Data: " + rowData)
                    for (let i = data.length - 1; i >= 0; i--) {
                        let rowInfo = createNewRowData(data[i].displayName, data[i].queryType, data[i].queryString, data[i].queryId);
                        gridOptions.api.updateRowData({add: [rowInfo]});
                        rowData.push();
                    }
                    console.log("Updated");

                },
                error: function () {
                    console.log("Failed to get query list.");
                },
            }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
        }
    };
    webSocket.onerror = function(event){
        console.log("Event Error: " + event.data);
    };
    webSocket.onclose = function (event){
        console.log ("Socket Closed: " + event);
    };
}

function createNewRowData(name, type, description, queryId) {
    var newData = {
        name: name,
        type: type,
        description: description,
        queryId: queryId,
    };
    rowData.push(newData)
    return newData;
}

function onAddRow(receivedType, receivedQuery, receivedName, received) {
    let typeInput = document.getElementById("selectType").value
    var questionType = received ? receivedType : typeInput
    var question = received ? receivedQuery : document.getElementById("queryMessage").value
    var empty = (question === "") || (questionType == "--")
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
                webSocket.send("Added")
            },
            error: function(){
                console.log("Failed to post query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
zz
        //autoSizeAll()
    }

}
function onRemoveSelectedPre(completed){
    var selectedData = gridOptions.api.getSelectedRows();
    onRemoveSelected(completed, selectedData);
}

function onRemoveSelected(completed, selectedData) {
    completedQueries.push(selectedData[0]);
    console.log("Selected Data: " + selectedData[0].queryId);
        $.ajax({
            type: "POST",
            data: {classId: classId, queryId: selectedData[0].queryId},
            dataType: "text",
            url: "http://localhost:8080/class/query/delete",
            crossDomain: true,
            success: function(){
                var smallArray = [];
                for(let i=0; i<selectedData.length-1; i++){
                    smallArray[i] = selectedData[i+1];
                }
                console.log(smallArray);
                if(smallArray.length !== 0)
                    onRemoveSelected(completed, smallArray);
                else {
                    console.log("Deleting completed");
                    webSocket.send("Removed");
                }
                //autoSizeAll()
            },
            error: function(){
                successfulDeletion = false
                console.log("Failed to delete query.");
            },
        }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));

}

function clearEntries(){
    document.getElementById("queryMessage").value = ""
}

function updateNodeIndex(queryID, newIndex){
    $.ajax({
        type: "POST",
        data: {classId: classId, queryId: queryID, newIndex: newIndex},
        dataType: "text",
        url: "http://localhost:8080/class/query/delete",
        crossDomain: true,
        success: function(){
            successfulDeletion = true
            console.log("Successful query moved");
        },
        error: function(){
            successfulDeletion = false
            console.log("Failed to move query.");
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
}

function onRowDragEnd(event) {
    console.log(rowData);
    var newIndexVal = rowData.length - 1- event.overIndex;
    console.log("Row ended moving: " + event.overIndex + " Row data: " + rowData[event.overIndex].queryId + " Actual position: " + newIndexVal);
    $.ajax({
        type: "POST",
        data: {classId: classId, queryId: moveQueryId, newIndex: newIndexVal},
        dataType: "text",
        url: "http://localhost:8080/class/query/move",
        crossDomain: true,
        success: function(data){
            console.log(data);
            hasBeenMoved = false;
            webSocket.send("Moved");
        },
        error: function(){
            console.log("Failed to move query.");
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
}
function onRowDragMove(event) {
    if(!hasBeenMoved){
        moveQueryId = rowData[event.overIndex].queryId;
        hasBeenMoved = true;
    }
    var movingNode = event.node;
    var overNode = event.overNode;

    var rowNeedsToMove = movingNode !== overNode;

    if (rowNeedsToMove) {
        var movingData = movingNode.data;
        var overData = overNode.data;

        var fromIndex = rowData.indexOf(movingData);
        var toIndex = rowData.indexOf(overData);

        var newStore = rowData.slice();
        moveInArray(newStore, fromIndex, toIndex);
    }

    function moveInArray(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }
}

function endClass(){
    $.ajax({
        type: "POST",
        data: {classId: classId},
        dataType: "text",
        url: "http://localhost:8080/class/delete/id",
        crossDomain: true,
        success: function(){
            webSocket.send("Closing")
            webSocket.close()
            gridOptions.api.setRowData([]);
        for(let i = 0; i < completedQueries.length; i++){
            gridOptions.api.updateRowData({add: [completedQueries[i]]});
        }
        document.getElementById("showName").innerHTML = "Your completed list";
            console.log("Successful class removal.");
        },
        error: function(){
            console.log("Failed to class query.");
        },
    }).then(r => console.log("Finished")).fail(r => console.log("Fail")).then(r => console.log("Message: " + r));
}