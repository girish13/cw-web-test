app.controller('orderController',function($rootScope,$scope, $uibModal, $log,api,orderService,$state,$window,dataService){

    $scope.restaurants = {};
    $scope.package = {};
    $scope.taxDetails = {};
    $scope.disableOrder = false;
    //$scope.totalPrice = 0;
    $scope.cust = {};
    $scope.error = {};
    $scope.orders = orderService.bag.restaurants;
    console.log($scope.orders);
    $scope.checkout = function(){
        $state.go('checkout');
    };
    $scope.isCollapsed = true;

    $scope.isBagEmpty = function(){
      return !Object.keys($scope.orders).length;
    };

    $scope.removeItem = function(menu,restMenus,restId){
        var index = restMenus.indexOf(menu);
        if(Object.keys(restMenus).length > 1)
        restMenus.splice(index, 1);
        else
         delete orderService.bag.restaurants[restId];
        orderService.refreshBag();
    };

    $scope.print = function(divName){
        //$window.print();
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    };
    $scope.fileName =  'order.html';
    $scope.save = function(divName){

            var elHtml = document.getElementById(divName).innerHTML;
            var link = document.createElement('a');
            var mimeType =  'text/plain';

            link.setAttribute('download', $scope.fileName);
            link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
            link.click();
    };

    $scope.calculateTotalPrice = function(){
        orderService.calculateTotalPrice();
    };

    $scope.openEditItemModal = function (menu_item,menu_item_id,menu_id,pre_package,restId) {
         var package_item = menu_item;
         package_item['id'] = menu_item_id;
         package_item['menu_id'] = menu_id;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'packageSelector.html',
            controller: 'packageSelectorModalController',
            size: 'md',
            resolve: {
                package_item : function(){
                    return package_item;
                },
                selectedMenuItemOptions : function(){
                    return pre_package;
                },
                restId : function(){
                    return restId;
                }
            }
        });


        modalInstance.result.then(function (result) {
            pre_package[package_item.id].categories[Object.keys(result.category)[0]] = result.category[Object.keys(result.category)[0]];
            orderService.refreshBag();
        }, function () {
        });
    };



    $scope.increaseQty = function(menu){
            if(menu.order_package_count < 200){
                menu.order_package_count++;
                orderService.refreshBag();
            }
    };


    $scope.decreaseQty = function(menu){
        if(menu.order_package_count > 10){
            menu.order_package_count--;
            orderService.refreshBag();
        }
    };

    $scope.editItem = function(item){
        var index = $rootScope.order.indexOf(item);
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

    $scope.orderObject = orderService.orderObject;

    $scope.placeOrder = function(){
        if(isNaN($scope.cust.mobile)){
            $scope.error.mobile = 'Your number is invalid';
            return false;
        }
        if(isNaN($scope.cust.pincode)){
            $scope.error.pincode = 'Your pincode is invalid';
            return false;
        }

        if($rootScope.searchDetails.date && $rootScope.searchDetails.time && $rootScope.searchDetails.selectedLocality.id){
            $scope.disableOrder = true;
        orderService.checkout($scope.cust).$promise.then(function(res){
            //console.log(res);
            $scope.response = res[0].order_id;
            if($scope.response){
                $scope.order_id = $scope.response;
                console.log($scope.order_id);
                $rootScope.order_id = $scope.order_id;
                $state.go('orderConfirmed');
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
        }
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