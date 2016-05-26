app.controller('playerController', function ($scope, $rootScope, $filter, $sce, $modalInstance, params, sysBitApi) {

    $scope.data = {};
    $scope.data.name = "";
    $scope.group = params.group;

    $scope.onOk = function () {

        // if player name is not entered, show ERROR
        if ($scope.data.name == "") {
            sysBitApi.showMsg(-1, "INPUT ERROR", "Player's name is required");
            return;
        }

        // call function to check this player you just entered
        firstChk($scope.data.name);
       
    };

    $scope.onCancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // check if player exist by userId
    function firstChk(name) {

        var objChk = {}
        objChk.data = {userId: name};     // player name entered        
        objChk.dbAction = "findOne";

       // check from mongo
        objChk.collectionName = "userId";   // does the player name exist in collection?



        sysBitApi.webApi(objChk).then(

                                            function (objResponse) {

                                                //  if player not in userId database
                                                if (objResponse.data == "") {

                                                    sysBitApi.showMsg(-1, "INVALID ENTRY", "User ID does not exist");
                                                    return;
                                                }
                                                else {

                                                    secondChk();

                                                   // $modalInstance.close($scope.data.name);
                                                }
                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );
    }

    function secondChk() {

        var group = $scope.data.myGroup;
        var objChk = {}
        objChk.data = { player: $scope.data.name, group: $scope.group };


        objChk.dbAction = "findOne"

        // for MonogDb
        objChk.collectionName = "scoreCard"


        sysBitApi.webApi(objChk).then(

                                            function (objResponse) {


                                                if (objResponse.data != "") {

                                                    sysBitApi.showMsg(-1, "INVALID ENTRY", "Player Exist!");
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