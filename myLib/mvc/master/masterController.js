app.controller('masterController', function ($scope, $rootScope, $q, $location, $filter, $modal, $timeout, sysBitApi) {

    $rootScope.preventNavigation = false;
    $rootScope.dirty = false;

    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
        if ($rootScope.preventNavigation == true) {
            event.preventDefault(); // This prevents the navigation from happening
        }
    });

    // Take care of preventing navigation out of our angular app
    window.onbeforeunload = function () {
        // Use the same data that we've set in our angular app
        if ($scope.form != undefined && $scope.form.hash != undefined) {

            if ($scope.form.hash != hash($scope.data)) {
                return "You have unsaved changes, do you want to continue?";
            }
        }
    }

    //$rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
    //    if ($rootScope.preventNavigation == true) {
    //        event.preventDefault(); // This prevents the navigation from happening
    //    }
    //});

    //var _preventNavigationUrl = null;

    //$rootScope.allowNavigation = function () {
    //    _preventNavigation = false;
    //};

    //$rootScope.preventNavigation = function () {
    //    _preventNavigation = true;
    //    _preventNavigationUrl = $location.absUrl();
    //}


    //$rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {

    //    if (_preventNavigationUrl != oldUrl || _preventNavigationUrl == null) {
    //        $rootScope.allowNavigation();
    //        return;
    //    }

    //    if (_preventNavigation && !confirm("You have unsaved changes, do you want to continue?")) {
    //        event.preventDefault();
    //    }
    //    else {
    //        $rootScope.allowNavigation();
    //    }



    //       // event.preventDefault(); // This prevents the navigation from happening

    //    });

    $scope.onLogOut = function () {
            $rootScope.preventNavigation = false;
            $location.path("/");
        }

        $scope.onMenu = function () {
                $rootScope.preventNavigation = false;
                $location.path("/menu");
            }


       // }
        //$scope.onMenu = function () {

        //    if ($scope.masterForm.$dirty == true) {
        //        $location.path("/menu");
        //    }

          
        //}

       $scope.load = function () {


           $scope.form = {};
           $scope.form.isDirty = false;
           $scope.mongoAggregate = [];
            $scope.form.rightsKey = '';
            $scope.form.rights = [];
            $scope.form.updated = false;
            $scope.form.subTable = {};
            $scope.form.html = [];
            $scope.local = {};

            $scope.form.title = '';
            $scope.form.tableName = '';

            $scope.form.tableQuery = [];
            $scope.form.lookUpList = [];

            $scope.form.tableMode = 0;
            $scope.form.formMode = 1;
            $scope.form.insMode = 2;
            $scope.form.viewMode = 3;
            $scope.form.updMode = 4;
            $scope.form.mode = $scope.form.tableMode;

            $scope.form.msgError = -1;
            $scope.form.msgAlert = 0;
            $scope.form.msgConfirm = 1;
            $scope.form.msgSuccess = 8;

            $scope.form.hideView = false;
            $scope.form.hideSave = false;
            $scope.form.hideEdit = false;
            $scope.form.hideDelete = false;

            tableDefine();

            //$scope.form.tableCols = [];
            //$scope.form.tableCols.push({ field: '_id', displayName: 'Id', enableCellEdit: false, width: 0 });
            //$scope.form.tableCols.push({ field: '_ts', displayName: 'Ts', enableCellEdit: false, width: 0 })

         

        }

       $scope.init = function (tableName) {

           $scope.form.tableName = tableName;

     //     tableDefine();

            dataClear();

            lookUpListPop();

        //    tablePop(0);


        }
    
       //$scope.select = function () {
       //    tablePop(0);
       //}
    
       //$scope.onExit = function () {
       //    $location.path('/menu');
       //};

       $scope.onHome = function () {


           if ($scope.tableRow != -1 && $scope.tableRow != undefined) {
               $scope.form.tableApi.selection.selectRow($scope.form.table.data[$scope.tableRow]);
          
               $scope.refresh = true;
               $scope.refresh = false;
               // $scope.form.tableApi.grid.element[0].getElementsByClassName("ui-grid-viewport")[0].scrollTop = $scope.tableRow * 25;

               //$timeout(function () {
               //    $scope.refresh = false;
               //}, 0);

           }

           $scope.tableRow = -1;


           $scope.form.mode = $scope.form.tableMode;


           modeEvent($scope.form.tableMode)

           

        //   $scope.$apply();


       };

       function hash(str) {
           /*jshint bitwise:false */
           var i, l,hval
           str = JSON.stringify(str) ;

           hval = 0x811c9dc5 ;

           for (i = 0, l = str.length; i < l; i++) {
               hval ^= str.charCodeAt(i);
               hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
           }
          
               // Convert to 8 digit hex string
               return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
          
       }

       $scope.onInsert = function () {

           dataClear();

           $scope.form.hash = hash($scope.data);

           $scope.form.isDirty = false;

           $scope.form.mode = $scope.form.insMode;

           modeEvent($scope.form.insMode)


       };

       $scope.onView = function () {



           var args = {};


           var selrows = $scope.form.tableApi.selection.getSelectedRows();

           if (selrows[0] != undefined) {

               $scope.form.isDirty = false;


               $scope.form.mode = $scope.form.viewMode;

               dataClear();

               $scope.form.Id = selrows[0]._id;

               dataPop();

               modeEvent($scope.form.viewMode)


               //$scope.$apply();
           }
           else {

               sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select a Record");




           }



       };

       $scope.onDelete = function () {

           var selrows = $scope.form.tableApi.selection.getSelectedRows();
           var dlg;

           if (selrows[0] == undefined) {
               sysBitApi.showMsg($scope.form.msgAlert, "Invalid Action", "Please Select a Record");
               return;
           }




           var objMsg = {}
           objMsg.type = 1;
           objMsg.title = "Confirm Deletion ?";
           objMsg.text = "Record Will be Removed";


           var modalInstance = $modal.open({
               animation: false,
               templateUrl: 'myLib/mvc/msg/msgView.html',
               controller: 'msgController',
               size: 'sm',


               resolve: {
                   params: function () {
                       return objMsg;
                   }
               }
           });

           modalInstance.result.then(function () {

               var objDelete = {}

               if ($rootScope.config.dbType == "mongoDb") {
                   objDelete.dbAction = "remove";
                   objDelete.collectionName = $scope.form.tableName;
               } else {
                   objDelete.dbAction = "execSp";               // action to executive store Procedure
                   objDelete.dbSp = $scope.form.tableName + "Del";
               }

              
               objDelete.data = {}
               objDelete.data._id = selrows[0]._id;
               objDelete.data._ts = selrows[0]._ts;



               sysBitApi.webApi(objDelete).then(

                                                   function (objResponse) {


                                                       //sysBitApi.showMsg($scope.form.msgSuccess, "Deletion Confirmation", "Record has been Deleted");

                                                       tablePop(0);

                                                       dataEvent('dataDelete', true);


                                                   },
                                                   function (objErr) {

                                                       sysBitApi.showHttpErr(objErr);


                                                       dataEvent('dataDelete', false);


                                                   }
                                               );



           }, function () {
           });





       }

       $scope.onAbort = function () {

         

           if ($scope.form.hash != hash($scope.data)) {
       

               var objMsg = {}
               objMsg.type = 1;
               objMsg.title = "Unsaved Data";
               objMsg.text = "Do you want to abort ?";


               var modalInstance = $modal.open({
                   animation: false,
                   templateUrl: 'myLib/mvc/msg/msgView.html',
                   controller: 'msgController',
                   size: 'sm',


                   resolve: {
                       params: function () {
                           return objMsg;
                       }
                   }
               });

                    modalInstance.result.then(function () {
                       dataClear();

                       if ($scope.form.mode = $scope.form.insMode) {
                           $scope.form.mode = $scope.form.tableMode;
                           modeEvent($scope.form.tableMode)

                       }
                       else {
                           $scope.form.mode = $scope.form.viewMode;
                           dataPop();
                       }


               })


           } else {

               dataClear();

               if ($scope.form.mode = $scope.form.insMode) {
                   $scope.form.mode = $scope.form.tableMode;
                   modeEvent($scope.form.tableMode)

               }
               else {
                   $scope.form.mode = $scope.form.viewMode;
                   dataPop();
               }

           }
       }

       $scope.onSave = function () {

           if ($scope.form.subTable != undefined) {
               for (var key in $scope.form.subTable) {
                   if ($scope.form.subTable.hasOwnProperty(key)) {
                       $scope.data[key] =JSON.stringify($scope.form.subTable[key].data);
                   }
               }
           }


           if ($scope.form.html.length != 0) {
               for (var i = 0; i < $scope.form.html.length; i++) {
                   $scope.data[$scope.form.html[i]] = $sce.getTrustedHtml($scope.data[$scope.form.html[i]]);

               }
           }

           var objSave = {}

           


           var strDateTimeNow = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
          
           objSave.data = $scope.data;


           if ($rootScope.config.dbType == "mongoDb") {
               objSave.collectionName = $scope.form.tableName;

               if ($scope.form.mode == $scope.form.updMode) {

                   objSave.dbAction = "update";
                   objSave.data.updatedBy = $rootScope.userId;
                   objSave.data.updatedOn = strDateTimeNow;
               }
               else {
                   objSave.dbAction = "insert";
                   objSave.data.createdBy = $rootScope.userId;
                   objSave.data.createdOn = strDateTimeNow;
               }

              
           } else {

               objSave.dbAction = "execSp";

               if ($scope.form.mode == $scope.form.updMode) {

                   objSave.dbSp = $scope.form.tableName + "Upd";
                   objSave.data.updatedBy = $rootScope.userId;
                   objSave.data.updatedOn = strDateTimeNow;
               }
               else {
                   objSave.dbSp = $scope.form.tableName + "Ins";
                   objSave.data.createdBy = $rootScope.userId;
                   objSave.data.createdOn = strDateTimeNow;
               }

               // action to executive store Procedure
           }

          

           sysBitApi.webApi(objSave)
                            .then(
                                function (objResponse) {




                                    //if (strResponse.ok != 1 && strResponse.result.ok != 1) {

                                    //    sysBitApi.showMsg($scope.form.msgError, "Web Api Error", strResponse.Msg);

                                    //} else {

                                    if ($scope.form.mode == $scope.form.insMode) {

                                        if ($rootScope.config.dbType == "mongoDb") {
                                           
                                            $scope.form.Id = objResponse.data.insertedIds[0];
                                        } else {
                                            var row = objResponse.data[0];
                                            $scope.form.Id = row._id;
                                        }


                                    }

                                      
                                 


                                       // upLoadFiles($scope.form.Id);

                                        tablePop($scope.form.mode);

                                        dataPop();

                                        $scope.form.mode = $scope.form.viewMode;

                                        $scope.updated = true;

                                        dataEvent('dataSave', true);

                                     //   $scope.$apply();

                                   // }




                                },
                                function (objErr) {

                               

                                    sysBitApi.showHttpErr(objErr);

                                    dataEvent('dataSave', false);



                                }
                            )
           ;


       }

       $scope.onEdit = function () {
           $scope.form.mode = $scope.form.updMode;

           $rootScope.dirty = false;

           modeEvent($scope.form.updMode)

       }

       $scope.showTable = function () {
           if ($scope.form.mode == $scope.form.tableMode) {
               return true;
           }
           else {
               return false;
           }
       }

       $scope.isSaveMode = function () {
           if ($scope.form.mode == $scope.form.updMode | $scope.form.mode == $scope.form.insMode) {
               return true;
           }
           else {
               return false;
           }


       }

       $scope.isViewMode = function () {
           if ($scope.form.mode == $scope.form.viewMode) {
               return true;
           }
           else {
               return false;
           }
       }
    
       $scope.tablePop = function () {
           tablePop(0);
       }

       function lookUpListPop() {

           var promises = [];

           for (var j = 0; j < $scope.form.lookUpList.length; j++) {
               promises.push(lookUpListGet($q, $scope.form.lookUpList[j]));
           }

           $q.all(promises).then(
           function () {
               $scope.Done = true;

           },
           function () {
               $scope.Done = true;
           }
       ).finally(function () {


           for (var j = 0; j < $scope.form.lookUpList.length; j++) {
               $scope[$scope.form.lookUpList[j] + "List"] = promises[j].$$state.value;
           }

           dataEvent('listPop', true);
       });
       }

       function lookUpListGet(q, tableName) {

           var objSel = {};
           objSel.data = {};

           if ($rootScope.config.dbType == "mongoDb") {
               objSel.collectionName = tableName;
               objSel.dbAction = 'find';
               objSel.data = [];
               objSel.data.push({ $project: { _id: 0, "key": "$_id", "value": "$name" } });


           } else {

               objSel.dbAction = "execSp";               // action to executive store Procedure
               objSel.dbSp = tableName + "Key";                    // name of store procedure
           }



           var deferred = q.defer();

           sysBitApi.webApi(objSel)
                                              .then(
                                                   function (objResponse) {

                                                       deferred.resolve(objResponse.data);

                                                   },
                                                                          function (objErr) {
                                                                              sysBitApi.showHttpErr(objErr);
                                                                              deferred.reject(objErr);
                                                                          }
                                                                        );




           return deferred.promise;
       };

       function tableDefine() {


            $scope.form.table = {
                enableFiltering: true,
                showSelectionCheckbox: true,
                multiSelect: false
              //  rowTemplate: rowTemplate()
            };

            $scope.form.table.columnDefs = [];
       
            $scope.form.table.columnDefs.push({ field: '_id', displayName: 'Id', enableCellEdit: false, width: 0 });
            $scope.form.table.columnDefs.push({ field: '_ts', displayName: 'Ts', enableCellEdit: false, width: 0 })

            $scope.form.table.columnDefs[0].visible = false;
            $scope.form.table.columnDefs[1].visible = false;

            $scope.form.table.onRegisterApi = function (tableGridApi) {
                $scope.form.tableApi = tableGridApi;
            };




            $scope.form.table.data = [];
          



        }

        function rowTemplate() {
            return '<div ng-dblclick="grid.appScope.rowDblClick(row)" >' +
                     '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                     '</div>';
        }

        $scope.ObjectId = function (id) {
            return 'ObjectId("' + id + '")';
        }

        function ObjectId(id) {
            return 'ObjectId("' + id + '")';
        }

        function dataEvent(action, success) {
            var args = {};
            args.success = success;
            args.event = action;
            $scope.$broadcast('dataEvent', args);
        }

        function modeEvent(mode) {
            $scope.$broadcast('modeEvent', mode);
        }

       
        function dataClear() {

            $scope.data = {};

            dataEvent('dataClear', true);

         
        }

        function dataEvent(action, success) {
            var args = {};
            args.success = success;
            args.event = action;
            $scope.$broadcast('dataEvent', args);
        }

         function dataPop() {



            var objGet = {};

            if ($rootScope.config.dbType == "mongoDb") {
                objGet.collectionName = $scope.form.tableName;
                objGet.dbAction = "findOneById";
            }
            else {
                objGet.dbAction = "execSp";               // action to executive store Procedure
                objGet.dbSp = $scope.form.tableName + "Get";
            }


            objGet.data = {}
            objGet.data._id = $scope.form.Id
          

            sysBitApi.webApi(objGet)
                                               .then(
                                                    function (objResponse) {
                                                       
                                                        if ($rootScope.config.dbType == "mongoDb") {
                                                            $scope.data = objResponse.data;
                                                        }
                                                        else {
                                                            $scope.data = objResponse.data[0];
                                                        }

                                                        if ($scope.form.subTable != undefined) {
                                                            for (var key in $scope.form.subTable) {
                                                                $scope.form.subTable[key].data = [];
                                                                if ($scope.form.subTable.hasOwnProperty(key) && $scope.data[key] != undefined) {
                                                                    $scope.form.subTable[key].data = JSON.parse($scope.data[key]);

                                                                }
                                                            }
                                                        }

                                                        $scope.form.hash = hash($scope.data);

                                                        dataEvent('dataPop', true);


                                                     //   $scope.$apply();
                                                    },
                                                    function (objErr) {


                                                        sysBitApi.showHttpErr(objErr);


                                                        dataEvent('dataPop', false);




                                                    }
                                                    );









        }

        function tablePop(intType) {

            if (intType == 0) {
                $scope.form.table.data = [];
                $scope.loading = true;

            }

            var objSel = {};
         
           

            if ($rootScope.config.dbType == "mongoDb") {
                objSel.collectionName = $scope.form.tableName;
                objSel.dbAction = 'aggregate';

                objSel.data = [];

              
                for (var i = 0; i < $scope.mongoAggregate.length; i++) {
                    objSel.data[i] = $scope.mongoAggregate[i];
                }
               
                
                         
                if (intType != 0) {
                    objSel.data.push({$match: { _id: $scope.form.Id}});
                }

               
            } else {
                objSel.data = {};

                /////
                objSel.dbAction = "execSp";                                         // action to executive store Procedure
                objSel.dbSp = $scope.form.tableName + "Sel";

                if (intType == 0) {
                    objSel.data._id = null;
                } else {
                    objSel.data._id = $scope.form.Id
                }
            }
           


            sysBitApi.webApi(objSel).then(

                function (objResp) {

                    $scope.loading = false;

                    if (intType == $scope.form.tableMode | $scope.form.table.data == []) {
                          $scope.form.table.data = objResp.data;
                    }
                    else if (intType == $scope.form.insMode) {
                        $scope.tableRow = $scope.form.table.data.length;
                        $scope.form.table.data[$scope.tableRow] = objResp.data[0];
                    }
                    else {
                        for (var i = 0; i < $scope.form.table.data.length; i++) {
                            if ($scope.form.table.data[i]._id == $scope.form.Id) {
                                $scope.form.table.data[i] = objResp.data[0];
                                $scope.tableRow = i;
                                break;
                            }
                        }
                    }



                },

                function (objErr) {

                    $scope.loading = false;


                    sysBitApi.showHttpErr(objErr);

                }

                )


        }

        function modeEvent(mode) {
            $scope.$broadcast('modeEvent', mode);
        }

        $scope.disableControl = function (strInput) {

            if ($scope.form.mode == $scope.form.viewMode | $scope.form.mode == $scope.form.tableMode) {
                return true;
            }
            else {

                if ($scope.form.rights[strInput] == undefined) {
                    return false;
                } else {

                    var rights = '0';

                    if ($scope.form.isApprover == true) {

                        var allrights = $scope.form.rights[strInput].split(".");

                        if (allrights[1] != undefined) {
                            rights = allrights[1];
                        } else {
                            $log.info('Udefined rights Error for approver ' + strInput);
                            return true;
                        }
                    } else {
                        rights = $scope.form.rights[strInput];
                    }



                    if (rights == '0' | rights == '1') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }

        }

        $scope.hideControl = function (strInput) {

            if ($scope.form.mode == $scope.form.tableMode) {
                return true;
            }
            else {

                if ($scope.form.rights[strInput] == undefined) {
                    return false;
                } else {


                    if ($scope.form.isApprover == true) {

                        var allrights = $scope.form.rights[strInput].split(".");

                        if (allrights[1] != undefined) {
                            rights = allrights[1];
                        } else {
                            $log.info('Udefined rights Error for approver ' + strInput);
                            return true;
                        }
                    } else {
                        rights = $scope.form.rights[strInput];
                    }


                    if (rights == '0') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }

        }

    // required for date
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
});



app.filter('griddropdown', function () {
    return function (input, context) {
        var map = context.col.colDef.editDropdownOptionsArray;
        var idField = context.col.colDef.editDropdownIdLabel;
        var valueField = context.col.colDef.editDropdownValueLabel;
        var initial = context.row.entity[context.col.field];
        if (typeof map !== "undefined") {
            for (var i = 0; i < map.length; i++) {
                if (map[i][idField] == input) {
                    return map[i][valueField];
                }
            }
        } else if (initial) {
            return initial;
        }
        return input;
    };
});