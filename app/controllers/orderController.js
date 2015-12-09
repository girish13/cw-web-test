app.controller('orderController',function($rootScope){




});
app.controller('orderModalInstance',function($scope, $uibModal, $log){
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'orderModal.html',
            controller: 'orderModalInstanceController',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });


        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

app.controller('orderModalInstanceController',function($scope, $uibModalInstance, items){

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.animationsEnabled = true;


    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});