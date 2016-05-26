var objParams = {}
objParams.title = "myTitle";


var modalInstance = $modal.open({
    animation: false,
    templateUrl: 'myLib/mvc/msg/msgView.html',
    controller: 'msgController',
    size: 'sm',


    resolve: {
        params: function () {
            return objParams;
        }
    }
});

modalInstance.result.then(
    function () {
    },
    function () {
});

