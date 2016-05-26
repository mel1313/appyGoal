app.controller('statsController', ['$scope', '$rootScope', '$log', '$location', '$modal', '$q', 'sysBitApi', function ($scope, $rootScope, $log, $location, $modal, $q, sysBitApi) {

    //intialize
    $scope.data = {};
    $scope.myGroupList = [];
    
   // $scope.items = [
   //'The first choice!',
   //'And another choice for you.',
   //'but wait! A third!'
   // ];


    // define form
    $scope.form = {};
    $scope.form.title = 'Score Card';


    //define grid
    $scope.form.playerGroup = {
        multiSelect: false,
        enableCellEditOnFocus: true
    };


    // define columns for the grid
    $scope.form.playerGroup.columnDefs = [];   
    $scope.form.playerGroup.columnDefs.push({ field: "_id", displayName: "Player", width: "40%" });
    $scope.form.playerGroup.columnDefs.push({ field: "showGoal", displayName: "Goals", width: "20%" });
    $scope.form.playerGroup.columnDefs.push({ field: "present", displayName: "Attendance", width: "20%" });
    $scope.form.playerGroup.columnDefs.push({ field: "avg", displayName: "Avg Goals", width: "20%" });
   
    
    // register gridApi
    $scope.form.playerGroup.onRegisterApi = function (tableGridApi) {
        $scope.form.playerGroup.tableApi = tableGridApi;
    };

    setUp();

    function setUp() {

        var promises = [];


        promises.push(popGroup($q));


        $q.all(promises).then(
        function () {
           

        },
        function () {
           
        }
        ).finally(function () {

            $scope.data.myGroup = $scope.myGroupList[0].value;

                    popTable();
        });

    }

    function popGroup(q) {


        var objSel = {}
        objSel.data = [];
        objSel.dbAction = "aggregate" 

        
        objSel.collectionName = "scoreCard"  

        objSel.data.push({ $group: { _id: "$group" } });
        objSel.data.push({ $project: { key: '$_id', value: '$_id' } });
        objSel.data.push({ $sort: { _id: 1 } });


        var deferred = q.defer();

        sysBitApi.webApi(objSel).then(

                                            function (objResponse) {

                                                $scope.myGroupList = objResponse.data;


                                                deferred.resolve();


                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);
                                                deferred.reject(objErr);
                                            }
                                    );

        return deferred.promise;





    }

    // events triggered by view
    $scope.onAddScore = function () {

        // select row
        var selrows = $scope.form.playerGroup.tableApi.selection.getSelectedRows();

        // row not selected, throw error
        if (selrows[0] == undefined) {
            sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select a player");
            return;
        }

        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/addScore/addScoreView.html',
            controller: 'addScoreController',
            size: 'lg',

            
        });

        myInstance.result.then(
            function (objData) {

                    var objSave = {};


                    objSave.dbAction = "insert";
                    objSave.collectionName = "scoreCard";

                    objSave.data = {};
                    objSave.data.goal = objData.goal;
                    objSave.data.date = objData.date;

                    objSave.data.verifiedGoal = 0;
                    objSave.data.verified = false;
                    objSave.data.group = $scope.data.myGroup;
                    
                // save player who scored
                    objSave.data.userId = selrows[0]._id;

              

                    sysBitApi.webApi(objSave)
                                    .then(
                                        function (objResponse) {

                                            popTable();
                                        },
                                        function (objErr) {



                                            sysBitApi.showHttpErr(objErr);


                                        }
                                    );

                },
           

                function () {


                });
    }

    $scope.onAddGame = function () {

      

        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/addGame/addGameView.html',
            controller: 'addGameController',
            size: 'lg',

            resolve: {
                params: function () {
                    return $scope.data.myGroup;             // by group
                }
            }

        });


        myInstance.result.then(
       function (objData) {

           for (var i = 0; i < objData.players.length; i++) {                   // for every player who attended



               var objSave = {};


               objSave.dbAction = "insert";
               objSave.collectionName = "scoreCard";

               objSave.data = {};                                               // save info (below)
               objSave.data.group = $scope.data.myGroup;                        // groups that players belong to
               objSave.data.gamesDate = objData.gamesDate;                      // date played
               objSave.data.player = objData.players[i].player;                 // player
               objSave.data.goal = parseInt(objData.players[i].goal);           // player goal

               if (objData.players[i].present == true) {

                   objSave.data.present = 1;
               }
               else {

                   objSave.data.present = 0;
               }

                // attendance
               
               objSave.data.valid = true;
               objSave.data.verified = false;
               
               objSave.data.verifiedGoal = 0;

               sysBitApi.webApi(objSave).then(

                                        function (objResponse) {

                                            popTable();
                                        },
                                        function (objErr) {

                                            sysBitApi.showHttpErr(objErr);

                                        }
                                );

           } },
       function () {


       });

    }

    $scope.onVerify = function () {

       
        var myVerifyInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/verify/verifyView.html',
            controller: 'verifyController',
            size: 'lg',
        });

        myVerifyInstance.result.then(
    function (objData) {

        for (var i = 0; i < objData.length; i++) {



            var objUpd = {}
            objUpd.data = {};
            objUpd.dbAction = "update"

            objUpd.data._id = objData[i]._id;
            objUpd.data._ts = objData[i]._ts;
            objUpd.data.verified = true;
            objUpd.data.verifiedGoal = objData[i].goal;
            objUpd.data.goal = 0;
            objUpd.data.verifiedBy = $rootScope.userId;

          

            objUpd.collectionName = "scoreCard" 

            sysBitApi.webApi(objUpd).then(

                                                function (objResponse) {

                                                    popTable();

                                                },
                                                function (objErr) {

                                                    sysBitApi.showHttpErr(objErr);

                                                }
                                        );
        }},
        function () {
        });
    
    }

    $scope.onGroupChange = function () {

        popTable();

    }

    $scope.onAddPlayer = function () {


        
        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/player/playerView.html',
            controller: 'playerController',
            size: 'lg',

            resolve: {
                params: function () {
                    return { group: $scope.data.myGroup };             // by group
                }
            }
        });

        
        myInstance.result.then(
            function (name) {

               addPlayer(name)
            }
         )
    };

    $scope.onAddGroup = function () {

        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/group/groupView.html',
            controller: 'groupController',
            size: 'lg',
        });

        myInstance.result.then(
            function (name) {

                addGroup(name);

            }
         )

    };

    $scope.onEditGoal = function () {

        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/modifyGoal/modifyGoalView.html',
            controller: 'modifyGoalController',
            size: 'lg',

            resolve: {
                params: function () {
                    return $scope.data.myGroup;             // by group
                }
            }

        });

        myInstance.result.then(
      function (objData) {

          for (var i = 0; i < objData.length; i++) {                   // for every player who attended

              if (objData[i].goal != objData[i].originalGoal || objData[i].present != objData[i].originalPresent) {

                  var objSave = {};


                  objSave.dbAction = "update";
                  objSave.collectionName = "scoreCard";

                  objSave.data = {};

                  objSave.data._id = objData[i]._id;
                  objSave.data._ts = objData[i]._ts;
                  objSave.data.goal = parseInt(objData[i].goal);
                  
                  if (objData[i].present == true) {

                      objSave.data.present = 1;
                  }
                  else {

                      objSave.data.present = 0;
                  }



                  sysBitApi.webApi(objSave).then(

                                           function (objResponse) {

                                                 popTable();
                                              
                                           },
                                           function (objErr) {

                                               sysBitApi.showHttpErr(objErr);

                                           }
                                   );

              }
          }

      },
      function () {


      });



    }

    $scope.onViewHistory = function () {

        var myInstance = $modal.open({
            animation: true,
            templateUrl: 'mvc/playerHistory/playerHistoryView.html',
            controller: 'playerHistoryController',
            size: 'lg',

            resolve: {
                params: function () {
                    return $scope.data.myGroup;             // by group
                }
            }

        });
    }

    function popTable() {

        var objSel = {};

        objSel.collectionName = 'scoreCard';
        objSel.dbAction = 'aggregate';

        objSel.data = [];
        
        objSel.data.push({ $match: { group: $scope.data.myGroup} });                   

        objSel.data.push({
            $group: {
                _id: "$player",
                verifiedGoal: { $sum: "$verifiedGoal" },                
                goal: { $sum: "$goal" },
                present: { $sum: "$present" }
                

               
            }
        });



        sysBitApi.webApi(objSel).then(
                                            function (objResponse) {

                                                for (var i = 0; i < objResponse.data.length; i++) {

                                                    if (objResponse.data[i].verifiedGoal == 0 || objResponse.data[i].present == 0) {        

                                                        objResponse.data[i].avg = "";

                                                        if (objResponse.data[i].goal != 0) {

                                                            objResponse.data[i].showGoal = " (" + objResponse.data[i].goal + ")"

                                                        }
                                                        else {

                                                            objResponse.data[i].showGoal = "";
                                                        }

                                                    }

                                                    else {

                                                    objResponse.data[i].avg = objResponse.data[i].verifiedGoal / objResponse.data[i].present;

                                                    if (objResponse.data[i].goal != 0) {

                                                        objResponse.data[i].showGoal = objResponse.data[i].verifiedGoal + " (" + objResponse.data[i].goal + ")"

                                                    }
                                                    else {

                                                        objResponse.data[i].showGoal = objResponse.data[i].verifiedGoal;

                                                    }

                                                    

                                                    }

                                               

                                                }

                                                $scope.form.playerGroup.data = objResponse.data;  // show playerGroup
                                            },
                                            function (objErr) {

                                            }
                                            )

    }

    function addPlayer(player) {

        var objIns = {}
        objIns.data = {};
        objIns.data.player = player;
        
      
        objIns.data.group = $scope.data.myGroup;
        objIns.data.goal = 0;
        objIns.data.verifiedGoal = 0;
        objIns.data.present = 0;
        objIns.data.gamesDate = "01-Jan-1999";
        objIns.data.valid = false;
        objIns.data.verified = false;

        
        objIns.dbAction = "insert";

        // for MonogDb
        objIns.collectionName = "scoreCard";

        


        sysBitApi.webApi(objIns).then(

                                            function (objResponse) {

                                                
                                                popTable();
                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );

    }

    function addToGroupList(name) {

        $scope.myGroupList.push({ key: name, value: name });
        
        $scope.data.myGroup = name;

        popTable();
    }

    function addGroup(name) {

        var objIns = {}
        objIns.data = {};
        objIns.data.player = $rootScope.userId;


        objIns.data.group = name;

        objIns.data.goal = 0;
        objIns.data.verifiedGoal = 0;
        objIns.data.present = 0;
        objIns.data.gamesDate = "01-Jan-1999";
        objIns.data.valid = false;
        objIns.data.verified = false;


        objIns.dbAction = "insert"

        objIns.collectionName = "scoreCard"  
        
        sysBitApi.webApi(objIns)
                        .then(
                            function (objResponse) {

                                addToGroupList(name);
                                

                            },
                            function (objErr) {


                            })

    }


}]);