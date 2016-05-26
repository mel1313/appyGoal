app.controller('modifyGoalController', function ($scope, $rootScope, $filter, $sce, $modalInstance, params, sysBitApi) {

    // define form
    $scope.form = {};
    $scope.form.title = 'modify goal';

    $scope.group = params;


    //define grid
    $scope.form.modifyGoal = {
        multiSelect: true,
        enableCellEditOnFocus: true
    };

    // grid columns
    $scope.form.modifyGoal.columnDefs = [];

    $scope.form.modifyGoal.columnDefs.push({ field: "player", displayName: "player", enableCellEdit: false });
   // $scope.form.modifyGoal.columnDefs.push({ field: "gamesDate", displayName: "Date", enableCellEdit: false });

    $scope.form.modifyGoal.columnDefs.push({ field: 'gamesDate', displayName: 'Date', width: '20%', enableCellEdit: false, cellFilter: 'date:\'dd-MMM-yyyy\'' });

    $scope.form.modifyGoal.columnDefs.push({ field: "present", displayName: 'Attendance', type: 'boolean', cellTemplate: '<input type="checkbox" ng-model="row.entity.present">' });
    $scope.form.modifyGoal.columnDefs.push({ field: "goal", displayName: "Unverified Goal"});

    // populate grid
    popTable();

    $scope.form.modifyGoal.onRegisterApi = function (tableGridApi) {
        $scope.form.modifyGoal.tableApi = tableGridApi;
    };

    $scope.onOk = function () {

        for (var i = 0; i < $scope.form.modifyGoal.data.length; i++) {

            if ($scope.form.modifyGoal.data[i].present == false) {

                sysBitApi.showMsg(-1, "INPUT ERROR", "you can't leave attendance empty with goals scored");
                return
            }
        }
    
        

        $modalInstance.close($scope.form.modifyGoal.data);

    
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function popTable() {

        var objSel = {}
        objSel.data = [];
        objSel.dbAction = "aggregate";


        objSel.collectionName = "scoreCard";

        objSel.data.push({ $match: { group: $scope.group, valid: true, verified: false } });
        objSel.data.push({ $project: { player: 1, gamesDate: 1, present: 1, goal: 1, originalGoal: '$goal', originalPresent: '$present', _ts: 1 } });
        objSel.data.push({ $sort: { gamesDate: -1 } });


        sysBitApi.webApi(objSel).then(

                                            function (objResponse) {

                                                $scope.form.modifyGoal.data = objResponse.data;

                                                for (var i = 0; i < objResponse.data.length; i++) {

                                                    if (objResponse.data[i].present == 1) {

                                                        $scope.form.modifyGoal.data[i].present = true;
                                                    }
                                                    else {

                                                        $scope.form.modifyGoal.data[i].present = false;

                                                    }

                                                }

                                               


                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );



    }


});
