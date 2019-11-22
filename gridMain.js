var columnDefs = [
    {field: "Make", field: "make", rowDrag: true},
    {field: "Model", field: "model"},
    {field: "Price", field: "price", filter: 'agNumberColumnFilter'}
];

var rowData = [
    {id: 'aa', make: "Toyota", model: "Celica", price: 35000},
    {id: 'bb', make: "Ford", model: "Mondeo", price: 32000},
    {id: 'cc', make: "Porsche", model: "Boxter", price: 72000},
    {id: 'dd', make: "BMW", model: "5 Series", price: 59000},
    {id: 'ee', make: "Dodge", model: "Challanger", price: 35000},
    {id: 'ff', make: "Mazda", model: "MX5", price: 28000},
    {id: 'gg', make: "Horse", model: "Outside", price: 99000},
];

var gridOptions = {
    defaultColDef: {
        editable: true,
        sortable: true,
        filter: true
    },
    rowDragManaged: true,
    columnDefs: columnDefs,
    animateRows: true,
    rowSelection: 'multiple',
    rowData: rowData,
    pagination: false
};

var newCount = 1;

function createNewRowData() {
    var newData = {
        make: "Toyota " + newCount,
        model: "Celica " + newCount,
        price: 35000 + (newCount * 17),
        
    };
    newCount++;
    return newData;
}

function onAddRow() {
    var newItem = createNewRowData();
    var res = gridOptions.api.updateRowData({add: [newItem]});
    
}

function addItems() {
    var newItems = [createNewRowData(), createNewRowData(), createNewRowData()];
    var res = gridOptions.api.updateRowData({add: newItems});
    
}

function onRemoveSelected() {
    var selectedData = gridOptions.api.getSelectedRows();
    var res = gridOptions.api.updateRowData({remove: selectedData});
    
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
