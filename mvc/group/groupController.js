app.controller('groupController', function ($scope, $rootScope, $filter, $sce, $modalInstance, sysBitApi) {


    $scope.data = {};
    $scope.data.name = "";



    $scope.onOk = function () {

        if ($scope.data.name == "") {
            sysBitApi.showMsg(-1, "INPUT ERROR", "group name is required");
            return;
        }
       
        chkGroup($scope.data.name)

       
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function chkGroup(name) {

        var objChk = {}
        objChk.data = { group: name };

        objChk.dbAction = "findOne"
        
        objChk.collectionName = "scoreCard"

        sysBitApi.webApi(objChk).then(

                                            function (objResponse) {


                                                if (objResponse.data != "") {

                                                    sysBitApi.showMsg(-1, "INVALID ENTRY", "Group exist!");
                                                    return;
                                                }

                                                else {
                                                    $modalInstance.close($scope.data.name);
                                                }
                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );

    }

});
