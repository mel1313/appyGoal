app.controller('playerHistoryController', function ($scope, $rootScope, $filter, $sce, $modalInstance, params, sysBitApi) {

    $scope.data = {};
    $scope.data.title = "";
    $scope.form = {};
    $scope.data.player = "";

    $scope.group = params;

    $scope.playerList = [];

    $scope.form.historyTable = {
        multiSelect: true,
        enableCellEditOnFocus: true
    };


    $scope.form.historyTable.columnDefs = [];

    $scope.form.historyTable.columnDefs = [];
    $scope.form.historyTable.columnDefs.push({ field: "player", displayName: "Player", width: "20%", enableCellEdit: false });
    $scope.form.historyTable.columnDefs.push({ field: 'gamesDate', displayName: 'Date', width: '20%', enableCellEdit: false, cellFilter: 'date:\'dd-MMM-yyyy\'' });
    $scope.form.historyTable.columnDefs.push({ field: "present", displayName: "Attendance", width: "20%", enableCellEdit: false });
    $scope.form.historyTable.columnDefs.push({ field: "verifiedGoal", displayName: "Goals", width: "20%", enableCellEdit: false });
    $scope.form.historyTable.columnDefs.push({ field: "verifiedBy", displayName: "verifiedBy", width: "20%", enableCellEdit: false });
   
    

    popTable();

    playerList();

    $scope.onOk = function () {
        $modalInstance.close();
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };


    function playerList () {

        var objSel = {}
        objSel.data = [];
        objSel.dbAction = "aggregate";


        objSel.collectionName = "scoreCard";        

        objSel.data.push({ $match: { group: $scope.group} });             
        objSel.data.push({ $group: { _id: "$player" } });                
        objSel.data.push({ $project: { 'key': '$_id', value: '$_id', _id: 0 } });
                                     


        sysBitApi.webApi(objSel).then(

                                            function (objResponse) {
                                           

                                              $scope.playerList = objResponse.data;      

                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );


    }

    function popTable() {

        var objSel = {}
        objSel.data = [];
        objSel.dbAction = "aggregate";


        objSel.collectionName = "scoreCard";

        if ($scope.data.player == "") {

            objSel.data.push({ $match: { group: $scope.group, valid: true } });
            objSel.data.push({ $sort: { gamesDate: -1 } });

        }
        else {

            objSel.data.push({ $match: { group: $scope.group, player: $scope.data.player, valid: true,} });
            objSel.data.push({ $sort: { gamesDate: -1 } });
        }


        sysBitApi.webApi(objSel).then(

                                            function (objResponse) {

                                                $scope.form.historyTable.data = objResponse.data;

                                              


                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );


    }

    $scope.onPlayerChange = function () {

        popTable();

    }

});
