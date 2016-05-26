app.controller('addGameController', function ($scope, $rootScope, $filter, $sce, $modalInstance, params, sysBitApi) {

    // initialize params
    $scope.group = params;
    $scope.gamesDate = "";
    
    // initialize
    $scope.data = {};
    $scope.data.noOfGames = 0;
    $scope.data.date = "";
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


    $scope.form = {};

     //grid
    $scope.form.playerTable = {
        multiSelect: true,
        enableCellEditOnFocus: true
    };

    //grid columns
    $scope.form.playerTable.columnDefs = [];
    $scope.form.playerTable.columnDefs.push({ field: "player", displayName: "player", enableCellEdit: false });    
    $scope.form.playerTable.columnDefs.push({ field: "present", displayName: 'Attendance', type: 'boolean', cellTemplate: '<input type="checkbox" ng-model="row.entity.present">' });
    $scope.form.playerTable.columnDefs.push({ field: "goal", displayName: "Goal" });
    
    //communicate with grid
    $scope.form.playerTable.onRegisterApi = function (tableGridApi) {
        $scope.form.playerTable.tableApi = tableGridApi;
    };

  
    popTable();

    $scope.onOk = function () {

        if ($scope.data.date == "") {
            sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select A Date");
            return;
        }

        $scope.gamesDate = $filter('date')($scope.data.date, "yyyy-MM-dd");

        dateUnique();
        
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // 
    function popTable() {

        var objMember = {}
        objMember.data = [];
        objMember.dbAction = "aggregate"

        
        objMember.collectionName = "scoreCard";
        objMember.data.push({ $match: { group: $scope.group, gamesDate: "01-Jan-1999" } }); 
        objMember.data.push({ $project: { _id: 0, player: 1 } });
        
        sysBitApi.webApi(objMember).then(

                                            function (objResponse) {

                                                for (var i = 0; i < objResponse.data.length; i++) {

                                                    objResponse.data[i].goal = 0;
                                                    objResponse.data[i].present = false;

                                                }

                                                $scope.form.playerTable.data = objResponse.data;
                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );

    }

    function dateUnique() {

        var objChk = {}
        
        objChk.dbAction = "findOne"

        
        objChk.collectionName = "scoreCard"

        objChk.data = { group: $scope.group, gamesDate: $scope.gamesDate }

        


        sysBitApi.webApi(objChk).then(

                                            function (objResponse) {

                                                if (objResponse.data == "") {

                                                    $scope.data.players = $scope.form.playerTable.data;
                                                    $scope.data.gamesDate = $scope.gamesDate;

                                                    $modalInstance.close($scope.data);

                                                }
                                                else {

                                                    sysBitApi.showMsg(-1, "INVALID INPUT", "Date exists for group");
                                                    return;
                                                }

                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );



    }

});