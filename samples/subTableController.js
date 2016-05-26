

$scope.form.subTable.xxxx = {                   // add features to subTable

    multiSelect: false,
    enableCellEditOnFocus: true

};

$scope.form.subTable.xxxx.onRegisterApi = function (tableGridApi) {         //conversation with the grid
    $scope.form.subTable.xxxx.tableApi = tableGridApi;
};


$scope.onAddRow = function (subTable) {

    var xxxx = {};
    xxxx.fromLocation = "";
    xxxx.toLocation = "";
    xxxx.rate = "";
    xxxx.leadTime = "";
    xxxx.tolerance = "";

    $scope.form.subTable.xxxx.data[$scope.form.subTable.xxxx.data.length] = xxxx;

}


$scope.onDelRow = function (subTable) {

    var selrows = $scope.form.subTable.xxxx.tableApi.selection.getSelectedRows();


    if (selrows[0] == undefined) {
        sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select a Record");
        return;
    }

}


