
//// required for date
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