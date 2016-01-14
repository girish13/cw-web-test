app.controller('orderController',function($rootScope,$scope, $uibModal, $log,api,orderService,$state){

    $scope.hotels = {};
    $scope.package = {};
    $scope.taxDetails = {};

    //$scope.totalPrice = 0;
    $scope.cust = {};
    $scope.checkout = function(){
        $state.go('checkout');
    };
    $scope.isCollapsed = true;

    $scope.removeItem = function(item){
        var index = $rootScope.order.indexOf(item);
        $rootScope.order.splice(index, 1);
    };


    $scope.calculateTotalPrice = function(){
        orderService.calculateTotalPrice();
    };

    //if($rootScope.total){
    //    $scope.totalAmount = $rootScope.total.totalAmount;
    //    $scope.subTotal = $rootScope.total.subTotal;
    //    $scope.totalTax = $rootScope.total.totalTax;
    //}

    //$scope.$watch($rootScope.total,function(newVal,oldVal){
    //    $scope.totalAmount = $rootScope.total.totalAmount;
    //    $scope.subTotal = $rootScope.total.subTotal;
    //    $scope.totalTax = $rootScope.total.totalTax;
    //    console.log($rootScope.total);
    //},true);
    //$scope.calculateTotalPrice();

    $scope.increaseQty = function(item){
        var index = $rootScope.order.indexOf(item);
        if($rootScope.order[index][2].type == 'a-la-carte'){
            //if($rootScope.order[index][4] > 1)
            $rootScope.order[index][4]++;
        }
        else if($rootScope.order[index][2].type == 'package'){
            //if($rootScope.order[index][6] > 1)
            $rootScope.order[index][6]++;
        }
        orderService.addOrder(item[1],item[2],item[3],item[4],item[5],item[6],item[7]);
        $scope.removeItem(item);
        //console.log(item[4]);
    };


    $scope.decreaseQty = function(item){
        var index = $rootScope.order.indexOf(item);
        if($rootScope.order[index][2].type == 'a-la-carte'){
            if($rootScope.order[index][4] > 1)
                $rootScope.order[index][4]--;
        }
        else if($rootScope.order[index][2].type == 'package'){
            if($rootScope.order[index][6] > 1)
                $rootScope.order[index][6]--;
        }
        orderService.addOrder(item[1],item[2],item[3],item[4],item[5],item[6],item[7]);
        $scope.removeItem(item);
        //console.log(item[4]);
    };

    $scope.editItem = function(item){
        var index = $rootScope.order.indexOf(item);
        console.log(item);
        console.log(index);
    };

    $scope.editOrder = function(){
        $state.go('editOrder');
    };



    $scope.showAlacarte = function(type){
        return type == 'a-la-carte';
    };
    $scope.showPackages = function(type){
        //console.log(type);
        return type == 'package';
    };
    $scope.orders = $rootScope.order;

    //
    //$scope.calculateTotalPrice = function(){
    //    if($scope.orders.length > 1)
    //    {
    //        angular.forEach($scope.orders,function(value,key){
    //            $scope.tempTaxDetails    = api.getTaxDetails.query({id : value[1].id },function(){
    //                value.push($scope.tempTaxDetails);
    //                console.log(value);
    //            });
    //        });
    //    }
    //};

    //$scope.orderNow = orderService.checkout();
    $scope.orderObject = orderService.orderObject;

    $scope.placeOrder = function(){
        //console.log($scope.cust);
        orderService.checkout($scope.cust).$promise.then(function(res){
            $scope.response = res[0].order_id;
            if($scope.response){
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'orderCompletion.html',
                    controller: 'orderResponseModalInstanceController',
                    resolve: {
                        order_id : function(){
                            return $scope.response;
                        }
                    }
                });
            }
            else {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'orderError.html',
                    controller: 'orderResponseModalInstanceController',
                    resolve: {
                        order_id : function(){
                            return '0';
                        }
                    }
                });
            }
        });
        //$scope.response = orderService.response;
        //console.log($scope.response);
        //console.log($scope.response.order_id);

    };


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

app.controller('orderResponseModalInstanceController',function($scope,$uibModalInstance,$state,order_id){
    if(order_id)
        $scope.order_id = order_id;

    $scope.home = function(){
        $state.go('home');
        $uibModalInstance.close();
    };
});