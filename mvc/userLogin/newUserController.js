app.controller('newUserController', ['$scope', '$rootScope', '$log', '$location','$filter', 'sysBitApi', function ($scope, $rootScope, $log, $location,$filter, sysBitApi) {

   

    $scope.local = {};
    $scope.data = {};
    $scope.data.pswd = "";
    $scope.data.name = "";
    $scope.data.gender = "";
    $scope.local.dob = "";
    $scope.data.email = "";
    $scope.data.userId = "";
    
    $scope.countryList = [];

    $scope.local = {};
    $scope.local.confirmPswd = "";
  
    popCountry();
    
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

    popCountry();


    $scope.onSaveNewUser =  function () {

       
        if (!$scope.masterForm.$valid) {
            sysBitApi.showMsg(-1, "INPUT ERROR", "Invalid Entries")
            return;
        }

        if ($scope.data.pswd != $scope.local.confirmPswd) {
            sysBitApi.showMsg(-1, "INPUT ERROR", "confirm password and password must be the same")
            return;
        }

        
        chkNewUser();


    }

    $scope.onAbort = function () {

        $location.path("/");
    }

    function saveNewUser() {

       
        
            var objSave = {};
            var pswd = $scope.data.pswd;    

            objSave.dbAction = "newUser";
            objSave.collectionName = "userId";

            
            objSave.data = $scope.data;
            objSave.data.pswd = sysBitApi.hashCode($scope.data.userId + $scope.data.pswd);
            objSave.data.userGroup = "57163715af73dc6bc6173312";
            objSave.data.score = 0;
            objSave.data.dob = $filter('date')($scope.local.dob, "dd-MMM-yyyy");

            objSave.data.assist = 0;

            sysBitApi.webApi(objSave)
                            .then(
                                function (objResponse) {

                                    $rootScope.newUser = {};
                                    $rootScope.newUser.userId = $scope.data.userId;
                                    $rootScope.newUser.pswd = pswd;

                                    $location.path("/");

                                    





                                },
                                function (objErr) {



                                    sysBitApi.showHttpErr(objErr);

                                   



                                }
                            )
        ;


    }

    function chkNewUser() {

        var objChk = {};
        objChk.data = { userId: $scope.data.userId };       // userId entered
        objChk.dbAction = "findOne";

        
        objChk.collectionName = "userId";                   // does it exist with collection?

       


        sysBitApi.webApi(objChk).then(

                                            function (objResponse) {

                                                // if userId is not new 
                                                if (objResponse.data != "") {

                                                    sysBitApi.showMsg(-1, "INVALID ENTRY", "User ID exist, Please use another userID");
                                                    return;
                                                }
                                                else {

                                                    // if new, save user in database
                                                    saveNewUser();
                                                }
                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );

    }

    function popCountryOld() {

        var objSel = {}
        objSel.data = [];
        objSel.dbAction = "aggregate";


        objSel.collectionName = "country";          // from this data

        objSel.data.push({ $project: { _id: 0, key: 1, value: 1 } });       // show key & value

        sysBitApi.webApi(objSel).then(

                                            function (objResponse) {

                                                $scope.countryList = objResponse.data;      // display the data

                                            },
                                            function (objErr) {

                                                sysBitApi.showHttpErr(objErr);

                                            }
                                    );


    }

    function popCountry() {


        sysBitApi.readFile("country.txt").then(                              // read the file
                       function (objResponse) {
                          
                           $scope.countryList = objResponse.data;

                       },
                       function (objErr) {
                           sysBitApi.showMsg(-1, objErr.statusText, objErr.data);

                       }
                   )
        ;



    }

}]);


