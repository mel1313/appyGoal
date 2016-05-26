app.controller('memberGroupController', ['$scope', '$rootScope', '$log', '$location','$modal', 'sysBitApi', function ($scope, $rootScope, $log, $location, $modal, sysBitApi) {


    // define form
    $scope.form = {};
    $scope.form.title = 'Group & Members'


    //define grid
    $scope.form.memberGroup = {                
        multiSelect: false,
        enableCellEditOnFocus: true
    };


    // define columns for the grid
    $scope.form.memberGroup.columnDefs = [];
    $scope.form.memberGroup.columnDefs.push({ field: "_id", displayName: "ID" });
    $scope.form.memberGroup.columnDefs.push({ field: "_ts", displayName: "TS" });
    $scope.form.memberGroup.columnDefs.push({ field: "group", displayName: "Group" });
    $scope.form.memberGroup.columnDefs.push({ field: "userId", displayName: "Member" });
  
    // hide columns
    $scope.form.memberGroup.columnDefs[0].visible = false;
    $scope.form.memberGroup.columnDefs[1].visible = false;

    // register gridApi
    $scope.form.memberGroup.onRegisterApi = function (tableGridApi) {        
        $scope.form.memberGroup.tableApi = tableGridApi;
    };

    // populate grid
    popGrid();

    // events triggered by view
    $scope.onCreate = function () {

        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/createGroup/createGroupView.html',
            controller: 'createGroupController',
            size: 'lg',
        });

        myInstance.result.then(
            function (name) {

                if (findOne("memberGroup", { "name": name }) == true) {

                    sysBitApi.showMsg(-1, "INPUT ERROR", "Group Exists");
                    return;
                }
                else {

                    var objSave = {};


                    objSave.dbAction = "insert";
                    objSave.collectionName = "memberGroup";

                    objSave.data = {};
                    objSave.data.group = name;
                    objSave.data.userId = $rootScope.userId;


                    sysBitApi.webApi(objSave)
                                    .then(
                                        function (objResponse) {

                                            $rootScope.groups.push({ group:name });

                                            popGrid();
                                        },
                                        function (objErr) {



                                            sysBitApi.showHttpErr(objErr);


                                        }
                                    );

                }},
            
                function () {


                });
            }
        
    $scope.onInvite = function () {


        // select row

        var selrows = $scope.form.memberGroup.tableApi.selection.getSelectedRows();

        // row not selected, throw error

        if (selrows[0] == undefined) {
            sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select a Group");
            return;
        }

        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/inviteMember/inviteMemberView.html',
            controller: 'inviteMemberController',
            size: 'lg',
        });

        myInstance.result.then(
            function (name) {

                var objSave = {};


                objSave.dbAction = "insert";
                objSave.collectionName = "memberGroup";

                objSave.data = {};
                objSave.data.userId = name;
                
                // save group selected 
                objSave.data.group = selrows[0].group;


                sysBitApi.webApi(objSave)
                                .then(
                                    function (objResponse) {

                                        // refresh grid
                                        popGrid();


                                    },
                                    function (objErr) {


                                    })
            }
         )
    };

    $scope.onLeave = function () {

        var selrows = $scope.form.memberGroup.tableApi.selection.getSelectedRows();



        if (selrows[0] == undefined) {
            sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select a Group");
            return;
        }

        var objRemove = {}
        objRemove.data = { group: selrows[0].group, userId: $rootScope.userId, _ts: selrows[0]._ts };  // selrows[0]. - remove row element
        objRemove.dbAction = "remove" 

       
        objRemove.collectionName = "memberGroup" 
       
        sysBitApi.webApi(objRemove).then(

                                            function (objResponse) {


                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );
    }

    // utility functions
    function findOne(collectionName, data) {



        var objFind = {};
        objFind.dbAction = "find";
        objFind.collectionName = collectionName;
        objFind.data = data;

        sysBitApi.webApi(objFind)
                                .then(
                                    function (objResponse) {



                                        if (objResponse.data.length == 0) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    },
                                    function (objErr) {


                                        sysBitApi.showHttpErr(objErr);

                                        return true;
                                    });


    }

    function popGrid() {

        var objSel = {};

        objSel.collectionName = 'memberGroup';
        objSel.dbAction = 'aggregate';

        objSel.data = [];
        objSel.data.push({ $project: { _id: 1, _ts: 1, userId: 1, group: 1 } }); // to be displayed in grid
        objSel.data.push({ $match: { $or: $rootScope.groups } });                   // show all unique groups


        sysBitApi.webApi(objSel)
                                        .then(
                                            function (objResponse) {

                                                $scope.form.memberGroup.data = objResponse.data;  // show memberGroup
                                            },
                                            function (objErr) {

                                            }
                                            )

    }
}]);