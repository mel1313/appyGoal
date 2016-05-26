app.controller('msgController', function ($scope, $rootScope, $filter, $sce, $modalInstance, params) {
    $scope.data = {};
    $scope.data.title = "  " + params.title;

    $scope.data.text = $sce.trustAsHtml(params.text);


    $scope.data.isError = false;
    $scope.data.isAlert = false;
    $scope.data.isConfirm = false;
    $scope.data.isSuccess = false;

    if (params.type == -1) {
        $scope.data.isError = true;
    }
    else if (params.type == 0) {
        $scope.data.isAlert = true;
    }
    else if (params.type == 1) {
        $scope.data.isConfirm = true;
    }
    else if (params.type == 8) {
        $scope.data.isSuccess = true;
    }



    $scope.onOk = function () {
        $modalInstance.close();
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
