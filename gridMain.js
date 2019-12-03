var columnDefs = [
    {field: "Name", field: "name", rowDrag: true},
    {field: "Type", field: "type", filter: true},
    {field: "Description", field: "description", resizable: true, editable: true}
];

var rowData = [
    {id: 'aa', name: "Andrew Holman", type: "Demo", description: "I would like to demo for Iteration 2"},
    {id: 'bb', name: "Patrick Wenzel", type: "Question", description: "For part 2 of the lab, how do I get started?"},
    {id: 'cc', name: "Luke", type: "Error", description: "I am getting a 400 error and I am not sure why"},
];

var gridOptions = {
    rowDragManaged: true,
    columnDefs: columnDefs,
    animateRows: true,
    rowSelection: 'multiple',
    rowData: rowData,
    domLayout: 'autoHeight',
    pagination: false
};

var newCount = 1;

function createConnection(){
    var webSocket = new WebSocket("wss://www.example.com/socketserver", "protocolOne");
    webSocket.onopen = function (event) {
        webSocket.send("Sample Text");
    };
    webSocket.onmessage = function (event){
        console.log(event.data);
    };
    webSocket.onerror = function(event){
        console.log(event.data);
    }
}

function createNewRowData() {
    var newData = {
        name: "Josh " + newCount,
        type: "Demo",
        description: "I would like to demo my code",
        
    };
    newCount++;
    return newData;
}

function onAddRow() {
    //var newItem = createNewRowData();
    //var res = gridOptions.api.updateRowData({add: [newItem]});
    $.ajax({
        type: "POST",
        data: {classId: 182, queryString: document.getElementById("queryMessage").value, queryType: document.getElementById("queryTypeText").value, userName: "andrew.holman321@gmail.com", displayName: "Andrew"},
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

}

function addItems() {
    var newItems = [createNewRowData(), createNewRowData(), createNewRowData()];
    var res = gridOptions.api.updateRowData({add: newItems});
    
}

function onRemoveSelected() {
    var selectedData = gridOptions.api.getSelectedRows();
    var res = gridOptions.api.updateRowData({remove: selectedData});
    
}

function complete(){
    onRemoveSelected()
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
