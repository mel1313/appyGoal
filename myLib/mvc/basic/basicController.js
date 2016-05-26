app.controller('transporterController', ['$scope', '$rootScope', '$log', 'sysBitApi', function ($scope, $rootScope, $log, sysBitApi) {

    $scope.load()


    $scope.form.title = 'Basic';

    $scope.form.table.name= 'basic';

    $scope.form.rights = $rootScope.rightsList['app'];

    // Define Columns for Table Grid display
   $scope.form.table.columnDefs.push({ field: 'name', displayName: 'Name', width: 200 })

    // Initialize 
    $scope.init()

    $scope.onSave = function () {


        $scope.$parent.onSave();

    }






}]);


