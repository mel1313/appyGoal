app.service("sysBitApi", function ($rootScope, $http, $q, $modal, Upload) {
   

    return ({
        readFile: readFile,
        showMsg: showMsg,
        showHttpErr: showHttpErr,
        webApi: webApi,
        getRightsList: getRightsList,
        upLoadFile: upLoadFile, 
        makeClone: makeClone,
        mergeObject: mergeObject,
        hashCode: hashCode
    });

   
    function hashCode(str) {
       
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = ~~(((hash << 5) - hash) + str.charCodeAt(i));
            }
            return hash;

    }

    function makeClone(source) {
        if (Object.prototype.toString.call(source) === '[object Array]') {
            var clone = [];
            for (var i = 0; i < source.length; i++) {
                clone[i] = makeClone(source[i]);
            }
            return clone;
        } else if (typeof (source) == "object") {
            var clone = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    clone[prop] = makeClone(source[prop]);
                }
            }
            return clone;
        } else {
            return source;
        }
    }



    function mergeObject(objDefault, objModify) {

        if (objModify != undefined) {
            for (var key in objDefault) {
                if (objDefault.hasOwnProperty(key)) {
                    if (objModify[key] != undefined) {
                        objDefault[key] = objModify[key];
                    }
                }
            }
        }

    }

    function readFile(strFile) {


        
        var request = $http({
            method: "get",
            url: strFile
        });

        return (request.then(handleSuccess, handleError));

        

    }

    function showHttpErr(objError) {

        var objMsg = {}

        objMsg.type = -1;
        objMsg.title = objError.status + ':' + objError.statusText ;
        if (objError.data == null) {
            objMsg.text = "Http Connection @ " + $rootScope.config.webApiUrl + " Not Responding";
        } else {
            objMsg.text = objError.data.msg;
        }
        var sizeBox = "md";

        
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'myLib/mvc/msg/msgView.html',
            controller: 'msgController',
            size: sizeBox,
            resolve: {
                params: function () {
                    return objMsg;
                }
            }
        });

        modalInstance.result.then(function () {



        }, function () {

        });


    }
        
    function showMsg(type, title, text) {

        var objMsg = {}

        objMsg.type = type;
        objMsg.title = title;
        objMsg.text = text;

        var sizeBox = "sm";

        if (objMsg.type == -1 | objMsg.type == 1) {
            sizeBox = "md";
        }


        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'myLib/mvc/msg/msgView.html',
            controller: 'msgController',
            size: sizeBox,
            resolve: {
                params: function () {
                    return objMsg;
                }
            }
        });

        modalInstance.result.then(function () {

        }, function () {

        });


    }


        
    function webApi(objData,webApiUrl) {

        if (webApiUrl == undefined) {
            webApiUrl = $rootScope.config.webApiUrl + '/webApi';
        } 

        if (objData.appName == undefined) {
            objData.appName = $rootScope.config.appName;
        }

        if (objData.dbName == undefined) {
            objData.dbName = $rootScope.config.dbName;
        }

        if (objData.dbType == undefined) {
            objData.dbType = $rootScope.config.dbType;
        }

       
        var request = $http({
            method: "post",
            url: webApiUrl,
            headers: { 'Content-Type': 'application/json' },
            accepts: 'application/json, text/javascript, */*',
            data: objData
        });


        return (request.then(handleSuccess, handleError));

    }

    function B64toUtf8(token) {
        return decodeURIComponent(escape(window.atob(token.replace(/\s/g, ''))));
    }

    function getRightsList(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');         // decrypt the token to get user rights
        var plain = B64toUtf8(base64);
        return  JSON.parse(plain);  


    }

    function upLoadFileNew(scope, metaData, file, upLoadUrl) {

        if (upLoadUrl == undefined) {
            upLoadUrl = $rootScope.config.filesUrl + 'upLoad';
        }

        var upLoadApi = Upload.upload({
            url: upLoadUrl,
            file: file,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data', 'metaData': metaData }, // only for html5
            fileName: 'doc.jpg',
            fieldname: 'xxx'
        }).progress(function (evt) {
            scope.progress = 'Progress ' + parseInt(100.0 * evt.loaded / evt.total) + ' %';
            //$scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
        });



        //var upLoadApi = Upload.upload({
        //    url: upLoadUrl, //webAPI exposed to upload the file
        //    headers: { 'Content-Type': 'multipart/form-data'},
        //    file: file,
        //    data: metaData


        //}).progress(function (evt) {
        //    scope.progress = 'Progress ' + parseInt(100.0 * evt.loaded / evt.total) + ' %';
        //    //$scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
        //});


        return (upLoadApi.then(handleSuccess, handleError));

    };



    function upLoadFile(scope, metaData, file, upLoadUrl) {

        if (upLoadUrl == undefined) {
            upLoadUrl = $rootScope.config.filesUrl + '/upLoad';
            }

        var upLoadApi = Upload.upload({
            url: upLoadUrl, //webAPI exposed to upload the file
            headers: { 'Content-Type': false, 'metaData': metaData },
            data: file

        }).progress(function (evt) {
            scope.progress = 'Progress ' + parseInt(100.0 * evt.loaded / evt.total) + ' %';
            //$scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
        });


        return (upLoadApi.then(handleSuccess, handleError));

    };

    function downLoadFileTest() {

        objFile = new Object();
        objFile.docLib = "docLib";
        objFile.docSet = "docSet";
        objFile.fileName = "test.pdf";


        var metaData = JSON.stringify(objFile);

        window.open('http://localhost:9000/downLoad/?metaData=' + metaData, '');

        if (bolEdit == true) {
            SysBitApi.LogEvt($scope.WFCode, $scope.Pk, $rootScope.AppClaims.UserId_Pk, 'CheckedOut ' + selrows[0].FileRef);

            GetLog($scope.Pk);
        }
        GetFiles();



    }


    //function upLoadFile() {
    //    var objFile = { file: $scope.files[0] };
    //    var objMetaData = {};

    //    objMetaData.docLib = "docLib";
    //    objMetaData.docSet = "docSet";
    //    objMetaData.title = $scope.files[0].title;
    //    objMetaData.fileName = $scope.files[0].fileName;


    //    // objMetaData.fileName = $scope.files[0].fileName;




    //    sysBitApi.upLoadFile($scope, 'http://localhost:9000/upLoad', JSON.stringify(objMetaData), objFile)
    //      .then(
    //                    function (strResponse) {

    //                        alert(strResponse);

    //                    },
    //                    function (strErrMsg) {
    //                        sysBitApi.showMsg($scope.form.msgError, "UpLoad File Error", strErrMsg);
    //                    }
    //                )
    //    ;

    //    return deferred.promise;
    //}




    function handleError(err) {
       
        return ($q.reject(err));
    }

    function handleSuccess(response) {
   
        return (response);
    }

});

app.directive('fileUploadBtn', function ($modal) {
    return {
        restrict: 'A',
        scope: {
            value: '=ngModel',
            title: '@title'
        },
        template: '<button style="padding:3px; background-color:rgba(255,255,255,0.0); float: right; border:none;" ng-click="onAddFile()"><img src="myLib/sysbit/icons/upload.png"></button>',
        link: function (scope, iElement, iAttrs) {


            scope.onAddFile = function () {


                try {

                    if (scope.AddOn == undefined) {
                        scope.AddOn = {};
                        scope.AddOn.title = scope.title;
                    }

                    var modalInstance = $uibModal.open({
                        animation: false,
                        templateUrl: 'lib/sysBit/app/addFile/addFileView.html',
                        controller: 'addFileController',
                        size: 'sm',
                        resolve: {
                            params: function () {
                                return scope.AddOn;
                            }
                        }
                    });

                    //var modalInstance = $modal.open({
                    //    animation: false,
                    //    templateUrl: 'appPgs/AddOnPg.html',
                    //    controller: 'AddOnCtrl',
                    //    size: '',
                    //    resolve: {
                    //        items: function () {
                    //            return scope.AddOn;
                    //        }
                    //    }
                    //});

                    modalInstance.result.then(function (objReturn) {
                        console.log('Finished');
                        // scope.value = objReturn;
                        scope.value.push(objReturn);


                    }, function () {
                        console.log('Modal dismissed at : ' + new Date());
                    });

                } catch (e) {
                    return e;
                }


            }
        }
    };
});


app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function (onChangeEvent) {
                var reader = new FileReader();

                reader.onload = function (onLoadEvent) {
                    scope.$apply(function () {
                        fn(scope, { $fileContent: onLoadEvent.target.result });
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});

////// Directives
//app.directive('tableDate', function ($filter) {
//    function parseDateString(dateString) {
//        if (typeof (dateString) === 'undefined' || dateString === '') {
//            return null;
//        }
//        var parts = dateString.split('/');
//        if (parts.length !== 3) {
//            return null;
//        }
//        var year = parseInt(parts[2], 10);
//        var month = parseInt(parts[1], 10);
//        var day = parseInt(parts[0], 10);

//        if (month < 1 || year < 1 || day < 1) {
//            return null;
//        }

//        var dt = new Date(year, (month - 1), day);

//        if (dt.getDay != undefined) {
//            return dt;
//        } else {
//            return null;
//        }

//    }
//    function pad(s) { return (s < 10) ? '0' + s : s; }
//    return {
//        priority: -100, // run after default uiGridEditor directive
//        require: '?ngModel',
//        link: function (scope, element, attrs, ngModel) {
//            scope.istableDate = false;

//            scope.$on('uiGridEventBeginCellEdit', function () {
//                scope.istableDate = true;
//            });

//            element.on("click", function () {
//                scope.istableDate = true;
//            });

//            element.bind('blur', function () {
//                if (!scope.istableDate) {
//                    scope.$emit('uiGridEventEndCellEdit');
//                } else {
//                    scope.istableDate = false;
//                }
//            }); //when leaving the input element, emit the 'end cell edit' event

//            if (ngModel) {
//                ngModel.$formatters.push(function (modelValue) {
//                    if (modelValue == undefined) {
//                        return '';
//                    }
//                    var modelValue = new Date(modelValue);
//                    ngModel.$setValidity(null, (!modelValue || !isNaN(modelValue.getTime())));
//                    return $filter('date')(modelValue, 'dd/MMM/yyyy');
//                });

//                ngModel.$parsers.push(function (viewValue) {
//                    if (viewValue) {
//                        var dateString = [pad(viewValue.getDate()), pad(viewValue.getMonth() + 1), viewValue.getFullYear()].join('/')
//                        var dateValue = parseDateString(dateString);
//                        ngModel.$setValidity(null, (dateValue && !isNaN(dateValue.getTime())));
//                        return dateValue;
//                    }
//                    else {
//                        ngModel.$setValidity(null, true);
//                        return null;
//                    }
//                });
//            }
//        }
//    };
//});


//app.filter('DateTime', function () {

//    return function (d) {

//        if (d == undefined | d == '') {
//            return undefined;
//        }
//        else if (d.constructor.toString().indexOf("Date") > -1) {
//            var dd = d.getDate()
//            if (dd < 10) dd = '0' + dd

//            var mm = d.getMonth() + 1
//            if (mm < 10) mm = '0' + mm

//            var yy = d.getFullYear()
//            return dd + '/' + mm + '/' + yy
//        }
//        else {
//            return d;
//        }




//    };
//});

//app.directive('ngBlur', function () {
//    return function (scope, elem, attrs) {
//        elem.bind('blur', function () {
//            scope.$apply(attrs.ngBlur);
//            scope.$emit('ngGridEventEndCellEdit');
//        });
//    };
//});

//ective('uiGridEditDatepicker', ['$timeout', '$document', 'uiGridConstants', 'uiGridEditConstants', function ($timeout, $document, uiGridConstants, uiGridEditConstants) {
//    return {
//        template: function (element, attrs) {
//            var html = '<div class="datepicker-wrapper" ><input type="text" uib-datepicker-popup datepicker-append-to-body="true" is-open="isOpen" ng-model="datePickerValue" ng-change="changeDate($event)" popup-placement="auto top"/></div>';
//            return html;
//        },
//        require: ['?^uiGrid', '?^uiGridRenderContainer'],
//        scope: true,
//        compile: function () {
//            return {
//                pre: function ($scope, $elm, $attrs) {

//                },
//                post: function ($scope, $elm, $attrs, controllers) {
//                    var setCorrectPosition = function () {
//                        var gridElement = $('.ui-grid-viewport');
//                        var gridPosition = {
//                            width: gridElement.outerWidth(),
//                            height: gridElement.outerHeight(),
//                            offset: gridElement.offset()
//                        };

//                        var cellElement = $($elm);
//                        var cellPosition = {
//                            width: cellElement.outerWidth(),
//                            height: cellElement.outerHeight(),
//                            offset: cellElement.offset()
//                        };

//                        var datepickerElement = $('body > .dropdown-menu, body > div > .dropdown-menu');
//                        var datepickerPosition = {
//                            width: datepickerElement.outerWidth(),
//                            height: datepickerElement.outerHeight()
//                        };

//                        var setCorrectTopPositionInGrid = function () {
//                            var topPosition;
//                            var freePixelsOnBottom = gridPosition.height - (cellPosition.offset.top - gridPosition.offset.top) - cellPosition.height;
//                            var freePixelsOnTop = gridPosition.height - freePixelsOnBottom - cellPosition.height;
//                            var requiredPixels = (datepickerPosition.height - cellPosition.height) / 2;
//                            if (freePixelsOnBottom >= requiredPixels && freePixelsOnTop >= requiredPixels) {
//                                topPosition = cellPosition.offset.top - requiredPixels + 10;
//                            } else if (freePixelsOnBottom >= requiredPixels && freePixelsOnTop < requiredPixels) {
//                                topPosition = cellPosition.offset.top - freePixelsOnTop + 10;
//                            } else {
//                                topPosition = gridPosition.height - datepickerPosition.height + gridPosition.offset.top - 20;
//                            }
//                            return topPosition;
//                        };

//                        var setCorrectTopPositionInWindow = function () {
//                            var topPosition;
//                            var windowHeight = window.innerHeight - 10;

//                            var freePixelsOnBottom = windowHeight - cellPosition.offset.top;
//                            var freePixelsOnTop = windowHeight - freePixelsOnBottom - cellPosition.height;
//                            var requiredPixels = (datepickerPosition.height - cellPosition.height) / 2;
//                            if (freePixelsOnBottom >= requiredPixels && freePixelsOnTop >= requiredPixels) {
//                                topPosition = cellPosition.offset.top - requiredPixels;
//                            } else if (freePixelsOnBottom >= requiredPixels && freePixelsOnTop < requiredPixels) {
//                                topPosition = cellPosition.offset.top - freePixelsOnTop;
//                            } else {
//                                topPosition = windowHeight - datepickerPosition.height - 10;
//                            }
//                            return topPosition;
//                        };


//                        var newOffsetValues = {};

//                        var isFreeOnRight = (gridPosition.width - (cellPosition.offset.left - gridPosition.offset.left) - cellPosition.width) > datepickerPosition.width;
//                        if (isFreeOnRight) {
//                            newOffsetValues.left = cellPosition.offset.left + cellPosition.width;
//                        } else {
//                            newOffsetValues.left = cellPosition.offset.left - datepickerPosition.width;
//                        }

//                        if (datepickerPosition.height < gridPosition.height) {
//                            newOffsetValues.top = setCorrectTopPositionInGrid();
//                        } else {
//                            newOffsetValues.top = setCorrectTopPositionInWindow();
//                        }

//                        datepickerElement.offset(newOffsetValues);
//                        datepickerElement.css("visibility", "visible");
//                    };

//                    $timeout(function () {
//                        setCorrectPosition();
//                    }, 0);



//                    $scope.datePickerValue = new Date($scope.row.entity[$scope.col.field]);
//                    $scope.isOpen = true;
//                    var uiGridCtrl = controllers[0];
//                    var renderContainerCtrl = controllers[1];

//                    var onWindowClick = function (evt) {
//                        var classNamed = angular.element(evt.target).attr('class');
//                        if (classNamed) {
//                            var inDatepicker = (classNamed.indexOf('datepicker-calendar') > -1);
//                            if (!inDatepicker && evt.target.nodeName !== "INPUT") {
//                                $scope.stopEdit(evt);
//                            }
//                        }
//                        else {
//                            $scope.stopEdit(evt);
//                        }
//                    };

//                    var onCellClick = function (evt) {
//                        angular.element(document.querySelectorAll('.ui-grid-cell-contents')).off('click', onCellClick);
//                        $scope.stopEdit(evt);
//                    };

//                    $scope.changeDate = function (evt) {
//                        $scope.row.entity[$scope.col.field] = $scope.datePickerValue;
//                        $scope.stopEdit(evt);
//                    };

//                    $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function () {
//                        if (uiGridCtrl.grid.api.cellNav) {
//                            uiGridCtrl.grid.api.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
//                                $scope.stopEdit();
//                            });
//                        } else {
//                            angular.element(document.querySelectorAll('.ui-grid-cell-contents')).on('click', onCellClick);
//                        }
//                        angular.element(window).on('click', onWindowClick);
//                    });

//                    $scope.$on('$destroy', function () {
//                        angular.element(window).off('click', onWindowClick);
//                        $('body > .dropdown-menu, body > div > .dropdown-menu').remove();
//                    });

//                    $scope.stopEdit = function (evt) {
//                        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
//                    };

//                    $elm.on('keydown', function (evt) {
//                        switch (evt.keyCode) {
//                            case uiGridConstants.keymap.ESC:
//                                evt.stopPropagation();
//                                $scope.$emit(uiGridEditConstants.events.CANCEL_CELL_EDIT);
//                                break;
//                        }
//                        if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
//                            evt.uiGridTargetRenderContainerId = renderContainerCtrl.containerId;
//                            if (uiGridCtrl.cellNav.handleKeyDown(evt) !== null) {
//                                $scope.stopEdit(evt);
//                            }
//                        } else {
//                            switch (evt.keyCode) {
//                                case uiGridConstants.keymap.ENTER:
//                                case uiGridConstants.keymap.TAB:
//                                    evt.stopPropagation();
//                                    evt.preventDefault();
//                                    $scope.stopEdit(evt);
//                                    break;
//                            }
//                        }
//                        return true;
//                    });
//                }
//            };
//        }
//    };
//}]);


//app.filter('textDate', ['$filter', function ($filter) {
//    return function (input, format) {
//        var date = new Date(input);
//        return $filter('date')(date, format);
//    };
//}]);
//app.directive('fileSelect', ['$window', function ($window) {
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        link: function (scope, el, attr, ctrl) {
//            var fileReader = new $window.FileReader();

//            fileReader.onload = function () {
//                ctrl.$setViewValue(fileReader.result);

//                if ('fileLoaded' in attr) {
//                    scope.$eval(attr['fileLoaded']);
//                }
//            };

//            fileReader.onprogress = function (event) {
//                if ('fileProgress' in attr) {
//                    scope.$eval(attr['fileProgress'], {'$total': event.total, '$loaded': event.loaded});
//                }
//            };

//            fileReader.onerror = function () {
//                if ('fileError' in attr) {
//                    scope.$eval(attr['fileError'], {'$error': fileReader.error});
//                }
//            };

//            var fileType = attr['fileSelect'];

//            el.bind('change', function (e) {
//                var fileName = e.target.files[0];

//                if (fileType === '' || fileType === 'text') {
//                    fileReader.readAsText(fileName);
//                } else if (fileType === 'data') {
//                    fileReader.readAsDataURL(fileName);
//                }
//            });
//        }
//    };
//}]);

//app.config(function ($datepickerProvider) {
//    angular.extend($datepickerProvider.defaults, {
//        dateFormat: 'dd/MM/yyyy',
//        startWeek: 1,
//        iconLeft: 'fa fa-arrow-left',
//        iconRight: 'fa fa-arrow-right'
//    });
//})