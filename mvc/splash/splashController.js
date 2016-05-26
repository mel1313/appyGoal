app.controller('splashController', function ($scope, $rootScope, $location) {

    $rootScope.transporterMode = false;

    if ($rootScope.userRights.Transporter != undefined) {
        if ($rootScope.userRights.Transporter.isTransporter == true) {
            $rootScope.transporterMode = true;
            $location.path("\podEntry");
        } else {
            $location.path("\menu");
        }

    } else {
        
        $location.path("\menu");
    }

});
