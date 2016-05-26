app.controller('verifyController', function ($scope, $rootScope, $filter, $sce, $modalInstance, sysBitApi) {


    // define form
    $scope.form = {};
    $scope.form.title = 'verify';

  
   
    //define grid
    $scope.form.verify = {
        multiSelect: true,
        enableCellEditOnFocus: true
    };


    $scope.form.verify.columnDefs = [];

    $scope.form.verify.columnDefs.push({ field: "_id", displayName: "ID" });
    $scope.form.verify.columnDefs.push({ field: "_ts", displayName: "TS" });
    $scope.form.verify.columnDefs.push({ field: "player", displayName: "Player", enableCellEdit: false });
    $scope.form.verify.columnDefs.push({ field: 'gamesDate', displayName: 'Date', width: '20%', enableCellEdit: false, cellFilter: 'date:\'dd-MMM-yyyy\'' });
    $scope.form.verify.columnDefs.push({ field: "goal", displayName: "Goal Scored", enableCellEdit: false });
    

    $scope.form.verify.columnDefs[0].visible = false;
    $scope.form.verify.columnDefs[1].visible = false;

    $scope.form.verify.onRegisterApi = function (tableGridApi) {
        $scope.form.verify.tableApi = tableGridApi;
    };
    
    popTable();

    $scope.onOk = function () {

       
        var selrows = $scope.form.verify.tableApi.selection.getSelectedRows();



        if (selrows[0] == undefined) {
            sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select a Member");
            return;
        }

        for (var i = 0; i < selrows.length; i++) {

            if ($rootScope.userId == selrows[i].player) {

                sysBitApi.showMsg(-1, "Invalid Action", "Your friends are allowed to verify your goals scored");
                return;
            }

        }

        $modalInstance.close(selrows);
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function popTable() {

        var objVerify = {}
        objVerify.data = [];
        objVerify.dbAction = "aggregate"


        objVerify.collectionName = "scoreCard"

        objVerify.data.push({ $match: { verified: false, valid: true } });
        objVerify.data.push({ $sort: { gamesDate: -1 } });



        sysBitApi.webApi(objVerify).then(

                                            function (objResponse) {

                                                $scope.form.verify.data = objResponse.data;


                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );



    }
});
