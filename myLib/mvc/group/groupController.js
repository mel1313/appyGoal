 app.controller('groupController', ['$scope', '$rootScope', '$log', 'sysBitApi' , function ($scope,$rootScope, $log, sysBitApi) {
      

        // navigation controls
        $rootScope.preventNavigation = true;
     

        // Initial Load
        $scope.load()


        $scope.form.title = 'Group';

       
        // Define Columns for Table Grid display
       $scope.form.table.columnDefs.push({ field: 'name', displayName: 'Name', width: 200 })

      

        // Initialize 
        $scope.init('userGroup')
        
        $scope.tablePop();


        getDefaultRights();

             

        function getDefaultRights() {

            $scope.defualtRights = []
            //$scope.defualtRights.push({ "name": "System", "rights": { "userId": false, 'group': false } });
            //$scope.defualtRights.push({ "name": "App", "rights": { "setUp": false } });
            //$scope.defualtRights.push({ "name": "Operations", "rights": { "podEntry": false, "podView": false, "uploadCsv": false, "podStore": false } });
            //$scope.defualtRights.push({ "name": "Transporter", "rights": { "isTransporter": false } });

            var objSel = {};

            if ($rootScope.config.dbType == "mongoDb") {
               

                objSel.collectionName = "config";
                objSel.dbAction = 'find';
                objSel.data = [];
                objSel.data.push({ $project: { _id: 0, key: 1, value: 1 } });
                objSel.data.push({ $match: { key: "rights" } });

            } else {
                objSel.dbAction = "execSp";               // action to executive store Procedure
                objSel.dbSp = "rightsKey";                    // name of store procedure
            }
            objSel.data = {};

            sysBitApi.webApi(objSel)
                                               .then(
                                                    function (objResponse) {

                                                        if ($rootScope.config.dbType == "mongoDb") {
                                                            $scope.defualtRights = objResponse.data[0].value;
                                                        }
                                                        else {
                                                            $scope.defualtRights = JSON.parse(objResponse.data[0].value);
                                                        }



                                                    },
                                                                           function (objErr) {
                                                                               sysBitApi.showHttpErr(objErr);

                                                                           }
                                                                         );





        };


        function popRights() {

  
            $scope.listRights = [];
            $scope.appRights = sysBitApi.makeClone($scope.defualtRights);

            var objRights = JSON.parse($scope.data.rightsList);


            for (var i = 0; i < $scope.appRights.length; i++) {
                var key = $scope.appRights[i].name;
                $scope.listRights[$scope.listRights.length] = { key: i, value: key };
              
                //if ($scope.data.rightsList[i] != undefined) {
                //    sysBitApi.mergeObject($scope.appRights[i].rights, $scope.data.rightsList[i].rights);
              // }

                for (var j = 0; j < objRights.length; j++) {
                    if (objRights[j].name == key) {
                        $scope.appRights[i].rights = objRights[j].rights;
                        break;
                    }
                }

              
            }

            $scope.appInput = {};

            if ($scope.listRights.length != 0) {
                $scope.onSelect(0);
            }
        }

        $scope.$on('dataEvent', function (event, result) {

            if (result.success = true && result.event == 'dataPop') {

                popRights();

              
                //$scope.listRights = [];
                //$scope.appRights = sysBitApi.makeClone($scope.defualtRights);

                //for (var i = 0; i < $scope.appRights.length; i++) {
                //    var key = $scope.appRights[i].name;
                //    $scope.listRights[$scope.listRights.length] = { key: i, value: key };

                //    if ($scope.data.rightsList[i] != undefined) {
                //        sysBitApi.mergeObject($scope.appRights[i].rights, $scope.data.rightsList[i].rights);
                //    }
                //}

                //$scope.appInput = {};

                //if ($scope.listRights.length != 0) {
                //    $scope.onSelect(0);
                //}


              
            }


        });
               
        $scope.$on('modeEvent', function (event, mode) {

          //  popRights();

            if (mode == $scope.form.tableMode) {
                $scope.listRights = undefined;
            } 
            else if (mode == $scope.form.insMode) {

                $scope.listRights = [];
                $scope.appRights = sysBitApi.makeClone($scope.defualtRights);

                for (var i = 0; i < $scope.appRights.length; i++) {
                    var key = $scope.appRights[i].name;
                    $scope.listRights[$scope.listRights.length] = { key: i, value: key };

                }

                if ($scope.listRights.length != 0) {
                    $scope.onSelect(0);
                }

                $scope.appInput = {};
            }
        });

        $scope.onSave = function () {

            //if ($scope.data.name == undefined | $scope.data.name == "") {
            //    sysBitApi.showMsg($scope.form.msgAlert, "Mandatory Data", "Group Name must be provided");
            //    return;
            //}
            if (!$scope.masterForm.$valid) {
                sysBitApi.showMsg(-1, "INPUT ERROR", "Invalid Entries")
                return;
            }

            $scope.data.rightsList = JSON.stringify($scope.appRights);


            $scope.$parent.onSave();

        }

     
        $scope.onSelect = function (varBtn) {
                    

            try {
                $scope.appInput = $scope.appRights[varBtn].rights;
                $scope.btnText = $scope.appRights[varBtn].name;

            } catch (e) {
                var msg = e.message;
            }

        }


        $scope.isBoolean = function (varValue) {
            if (typeof (varValue) === "boolean") {
                return true;
            }
            else {
                return false;

            }

        }





    }]);
