app.controller('addScoreController', function ($scope, $rootScope, $filter, $sce, $modalInstance) {


    //Initialize
    $scope.data = {};
   
    $scope.data.goal = 0;
    

    $scope.calendar = {
        opened: {},
        dateFormat: 'dd/MM/yyyy',
        dateOptions: {},
        open: function ($event, which) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.calendar.opened[which] = true;
        }
    };



    $scope.onOk = function () {
        $modalInstance.close($scope.data);
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

});