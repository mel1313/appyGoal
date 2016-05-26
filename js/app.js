var app = angular.module('app', ['ngRoute', 'ngTouch', 'ui.grid', 'ui.grid.selection',  'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.selection', 'ui.grid.pinning','ui.bootstrap', 'ui.grid.moveColumns','ngFileUpload','ngMessages'])

app.config(['$routeProvider', '$httpProvider' ,function ($routeProvider, $httpProvider) {


    //////Enable cross domain calls
    //$httpProvider.defaults.useXDomain = true;

    ////Remove the header used to identify ajax call  that would prevent CORS from working
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

  

    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }


    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';


    $httpProvider.interceptors.push(['$rootScope', '$q',  function ($rootScope, $q) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};

                var value = $rootScope.token;

                if (value != null) {
                   
                    if (value.length > 0) {
                        config.headers.Authorization = 'Token ' + value;
                    }
                }
                return config;
            },
            'responseError': function (response) {
           
                return $q.reject(response);
            }
        };
    }]);



    //////////////////////////////////////////////////////////////




    $routeProvider.

        when("/playerHistory", {
            templateUrl: "mvc/playerHistory/playerHistoryView.html",
            controller: "playerHistoryController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).

        when("/modifyGoal", {
            templateUrl: "mvc/modifyGoal/modifyGoalView.html",
            controller: "modifyGoalController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).
         when("/addGame", {
             templateUrl: "mvc/addGame/addGameView.html",
             controller: "addGameController",
             resolve: {
                 isAllowed: function ($rootScope, $q) {
                     var deferred = $q.defer();
                     if ($rootScope.isLogIn == true) {
                         deferred.resolve();
                     }


                     return deferred.promise;

                 }
             }

         }).

         when("/verifyFriend", {
             templateUrl: "mvc/verifyFriend/verifyFriendView.html",
             controller: "verifyFriendController",
             resolve: {
                 isAllowed: function ($rootScope, $q) {
                     var deferred = $q.defer();
                     if ($rootScope.isLogIn == true) {
                         deferred.resolve();
                     }


                     return deferred.promise;

                 }
             }

         }).


        when("/addScore", {
            templateUrl: "mvc/addScore/addScoreView.html",
            controller: "addScoreController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).

        when("/inviteMember", {
            templateUrl: "mvc/inviteMember/inviteMemberView.html",
            controller: "inviteMemberController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).

        when("/recordScore", {
            templateUrl: "mvc/recordScore/recordScoreView.html",
            controller: "recordScoreController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).

        when("/chat", {
            templateUrl: "mvc/chat/chatView.html",
            controller: "chatController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).

        when("/shop", {
            templateUrl: "mvc/shop/shopView.html",
            controller: "shopController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).

         when("/createGroup", {
             templateUrl: "mvc/createGroup/createGroupView.html",
             controller: "createGroupController",
             resolve: {
                 isAllowed: function ($rootScope, $q) {
                     var deferred = $q.defer();
                     if ($rootScope.isLogIn == true) {
                         deferred.resolve();
                     }


                     return deferred.promise;

                 }
             }

         }).

         when("/memberGroup", {
             templateUrl: "mvc/memberGroup/memberGroupView.html",
             controller: "memberGroupController",
             resolve: {
                 isAllowed: function ($rootScope, $q) {
                     var deferred = $q.defer();
                     if ($rootScope.isLogIn == true) {
                         deferred.resolve();
                     }


                     return deferred.promise;

                 }
             }

         }).

        when("/stats", {
            templateUrl: "mvc/stats/statsView.html",
            controller: "statsController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).
            when("/record", {
                templateUrl: "mvc/record/recordView.html",
                controller: "recordController",
                resolve: {
                    isAllowed: function ($rootScope, $q) {
                        var deferred = $q.defer();
                        if ($rootScope.isLogIn == true) {
                            deferred.resolve();
                        }


                        return deferred.promise;

                    }
                }

            }).

            when("/verify", {
                templateUrl: "mvc/verify/verifyView.html",
                controller: "verifyController",
                resolve: {
                    isAllowed: function ($rootScope, $q) {
                        var deferred = $q.defer();
                        if ($rootScope.isLogIn == true) {
                            deferred.resolve();
                        }


                        return deferred.promise;

                    }
                }

            }).

            when("/newUser", {
                templateUrl: "mvc/userLogin/newUserView.html",
                controller: "newUserController"
                
            }).


           when("/menu", {
          templateUrl: "mvc/menu/menuView.html",
          controller: "menuController",
          resolve: {
              isAllowed: function ($rootScope, $q) {
                  var deferred = $q.defer();
                  if ($rootScope.isLogIn == true) {
                      deferred.resolve();
                  }


                  return deferred.promise;

              }
          }

        }).
         when("/userId", {
            templateUrl: "myLib/mvc/userId/userIdView.html",
            controller: "userIdController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).
         when("/group", {
             templateUrl: "myLib/mvc/group/groupView.html",
             controller: "groupController",
             resolve: {
                 isAllowed: function ($rootScope, $q) {
                     var deferred = $q.defer();
                     if ($rootScope.isLogIn == true) {
                         deferred.resolve();
                     }


                     return deferred.promise;

                 }
             }

         }).
        when("/splash", {
            templateUrl: "mvc/splash/splashView.html",
             controller: "splashController",
            resolve: {
                isAllowed: function ($rootScope, $q) {
                    var deferred = $q.defer();
                    if ($rootScope.isLogIn == true) {
                        deferred.resolve();
                    }


                    return deferred.promise;

                }
            }

        }).

      when("/", { templateUrl: "mvc/userLogin/userLoginView.html", controller: "userLoginController" })
}])

