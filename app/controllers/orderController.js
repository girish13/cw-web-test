app.controller('orderController',function($rootScope,$scope, $uibModal, $log,api,orderService,$state){

    $scope.hotels = {};
    $scope.package = {};
    $scope.taxDetails = {};
    //$scope.totalPrice = 0;

    $scope.checkout = function(){
        $state.go('checkout');
    };

    angular.forEach($rootScope.order,function(value,key){
        $scope.totalPrice = (value[2].price + value[5])* value[6];
        $scope.totalTax = 0;
        $scope.hotels[key] = value[1] ;
        $scope.taxDetails[key] = api.getTaxDetails.query({id : $scope.hotels[key].id},function(){
            angular.forEach($scope.taxDetails[key],function(value1,key)
            {
                $scope.totalTax += value1 * 100;
                $scope.totalPrice += $scope.totalPrice * value1 ;
            });
        });
        $scope.package[key] = value[2];
    });

    $scope.showAlacarte = function(type){
        //console.log(type);
         return type == 'a-la-carte';
    };
    $scope.showPackages = function(type){
        //console.log(type);
        return type == 'package';
    };
    $scope.orders = $rootScope.order;

    $scope.orderNow = orderService.checkout();
    $scope.orderObject = orderService.orderObject;


    $scope.animationsEnabled = true;

    $scope.open = function () {


        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'orderModal.html',
            controller: 'orderModalInstanceController',
            resolve: {
                orders : function(){
                    return $scope.orders;
                }
            }
        });


        modalInstance.result.then(function () {

        }, function () {

        });
    };


});

app.controller('orderModalInstanceController',function($scope, $uibModalInstance,orders,orderService,$state){

    $scope.orders = orders;


    $scope.checkout = function(){
         $state.go('checkout');
    };



    $scope.animationsEnabled = true;


    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});