app.controller('logInController', function ($scope, $rootScope, $location, $window, $q, $timeout,  $http, Upload, sysBitApi) {

        $rootScope.isLogIn = false;
        $rootScope.userClaims = {};
        $rootScope.token = '';

        $scope.title = "Login Page";
        
        $scope.local = {};
        $scope.data = {};
        $scope.data.userId = "";
        $scope.local.pswd = "";
        $scope.data.newPswd = "";
        $scope.local.confirmPswd = "";
        $scope.data.reset = false;
        $rootScope.config = {};

        
      

        sysBitApi.readFile("config.txt").then(                              // read the file
                           function (objResponse) {
                               $rootScope.config = objResponse.data             // store the data from config.txt


                               if ($rootScope.config.userId != undefined) {
                                   $scope.data.userId = $rootScope.config.userId;
                               }

                               if ($rootScope.config.pswd != undefined) {
                                   $scope.local.pswd = $rootScope.config.pswd;
                               }

                           },
                           function (objErr) {
                               sysBitApi.showMsg(-1, objErr.statusText, objErr.data);

                           }
                       )
    ;


    

        $scope.onlogInClick = function () {


          

            if ($scope.data.userId.length == 0) {
                sysBitApi.showMsg($scope.form.msgAlert, "Mandatory Data", "Please enter UserId");
                return;
            }
            if ($scope.local.pswd.length == 0) {
                sysBitApi.showMsg($scope.form.msgAlert, "Mandatory Data", "Please enter Password");
                return;
            }


            if ($scope.data.reset == true) {
                if ($scope.local.newPswd.length == 0) {
                    sysBitApi.showMsg($scope.form.msgAlert, "Mandatory Data", "Please enter New Password");
                    return;
                }

                if ($scope.local.newPswd != $scope.local.confirmPswd) {
                    sysBitApi.showMsg($scope.form.msgAlert, "Mismatch", "New Password does not match with Confirm Password");
                    return;
                }

                
            }


            var strUserId = new String($scope.data.userId);
            var strPswd = new String($scope.local.pswd);


            $scope.data.pswd = sysBitApi.hashCode(strUserId.trim() + strPswd.trim());

            

            if ($scope.data.reset == true) {
                var strNewPswd = new String($scope.local.newPswd);
                $scope.data.newPswd = sysBitApi.hashCode(strUserId.trim() + strNewPswd.trim());
            } else {
                $scope.data.newPswd = '' ;
            }
         

            var objLogIn = {};                      
            objLogIn.dbAction = "logIn";               // action to executive store Procedure
       
            if ($rootScope.config.dbType == "mongoDb") {
                objLogIn.collectionName  = "userId";
            } else {
                objLogIn.dbSp = "logIn";
            }

            objLogIn.data = $scope.data;


            sysBitApi.webApi(objLogIn).then(

                function (objResp) {
                   
                    
                    $rootScope.token = objResp.data;                                    // save token for use in later submission
                    var objClaims = sysBitApi.getRightsList($rootScope.token);
                    $rootScope.userId = objClaims.userId;

                    if ($rootScope.config.dbType == "mongoDb") {
                        objClaims.rightsList = JSON.parse(objClaims.rightsList);
                    }
                    
                    $rootScope.userRights = {};

                    for (var i = 0; i < objClaims.rightsList.length; i++) {
                        $rootScope.userRights[objClaims.rightsList[i].name] = objClaims.rightsList[i].rights;
                    }




                    $rootScope.isLogIn = true;


                    $location.path("/splash");
                   
                    
                },

                function (objErr) {

                    sysBitApi.showHttpErr(objErr) ;

                }

                )

           
        }



    });