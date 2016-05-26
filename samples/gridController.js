$scope.table = {
    enableFiltering: true,
    showSelectionCheckbox: true,
    multiSelect: false
   
};

$scope.table.columnDefs = [];

$scope.table.columnDefs.push({ field: '_id', displayName: 'Id', enableCellEdit: false, width: 0});
$scope.table.columnDefs.push({ field: '_ts', displayName: 'Ts', enableCellEdit: false, width: 0 })
$scope.table.columnDefs.push({ field: 'reset', displayName: 'reset', type: 'boolean', cellTemplate: '<input type="checkbox" ng-model="row.entity.reset">' });
$scope.table.columnDefs.push({ field: 'startDate', displayName: 'Date', width: '20%', cellFilter: 'date:\'dd-MMM-yyyy\'' });


$scope.table.onRegisterApi = function (tableGridApi) {
    $scope.tableApi = tableGridApi;
};


