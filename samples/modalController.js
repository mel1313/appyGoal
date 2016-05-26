app.controller('modalController', function ($scope, $rootScope, $filter, $sce, $modalInstance, params, sysBitApi) {
    $scope.data = {};
    $scope.data.title = " ";



    $scope.onOk = function () {
        $modalInstance.close();
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
