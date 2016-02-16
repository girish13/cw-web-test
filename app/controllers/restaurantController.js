app.controller('restaurantController',function($rootScope,$scope,$stateParams,api,dataService,locationService,$state){
    $rootScope.custId = 0; // to be removed
    $scope.imagesPath = $rootScope.imagePath;
    $scope.isOrderBoxCollpsed = true;
    $scope.isDateTimeBoxCollpsed = true;
    $scope.openOrderSidebar = function(){
        $scope.isOrderBoxCollpsed = false;
    };
    $rootScope.restaurantId = $stateParams.id;
    $scope.restaurantId = $stateParams.id;
    $scope.getRestaurantDetails = function() {
        if (!$scope.restaurantDetails) {
            dataService.getRestaurantDetails($scope.restaurantId).$promise.then(function (res) {
                $scope.restaurantDetails = res;
                angular.forEach($scope.restaurantDetails[0], function (value, key) {
                    $scope.restaurant[key] = value;
                });
            });
        }

    };

    $scope.getRestaurantSchedule = function() {
        if(!$scope.restaurantSchedule) {
            $scope.restaurantSchedule = api.getRestaurantSchedule.query({id: $rootScope.restaurantId},function(){
            });
        }
    };

    $scope.goToSearch = function(){
        var locationString = $rootScope.searchDetails.selectedLocality.name + ' gurgaon';
        locationString = locationString.replace(/\s+/g, '-').toLowerCase();
        $state.go('search',{localityString : locationString,localityId : $rootScope.searchDetails.selectedLocality.id});
    };

    $scope.setParams = function(){
        if($stateParams.localityId && !$rootScope.searchDetails.selectedLocality){
            locationService.setLocality($stateParams.localityId).then(function(res){
                locationService.searchDetails.selectedLocality  = res;
            });
        }
    };

    $scope.setParams();
    $scope.getRestaurantDetails();
    $scope.getRestaurantSchedule();
});


app.controller('restaurantPackagesController',function($scope, $uibModal, $log, api,$rootScope,orderService,alertService,$stateParams,dataService){

    $scope.package = {};
    $scope.itemOptionCategories = {};
    $scope.additionalPrice = {};
    $scope.numberOfPackages = {};
    $scope.addInfo = {};
    $scope.isPackageCollapsed = {};
    $scope.loadingPackage = {};
    $scope.restaurantId = $stateParams.id;
    $scope.menu = {};
    $scope.menu_item = {};
    //loading wheels

    $scope.getRestaurantPackages = function(){
        $scope.loadingRestaurantPackages = true;
        dataService.getRestaurantPackages($scope.restaurantId).$promise.then(function(res){
            $scope.restaurantPackages = res;
            //console.log(res);
            angular.forEach($scope.restaurantPackages,function(value,key) {
                if (value.pricing.length == 1) {
                    value.price = value.pricing[0].price_per_person;
                }
                else if ($rootScope.searchDetails && $rootScope.searchDetails.pax) {
                    angular.forEach(value.pricing, function (value1, key) {
                        if ($rootScope.searchDetails.pax >= value1.min_pax && $rootScope.searchDetails.pax <= value1.max_pax) {
                            value.price = value1.price_per_person;
                        }
                    });
                }
                else {
                    value.price_min = value.pricing[0].price_per_person;
                    value.price_max = value.pricing[value.pricing.length - 1].price_per_person;
                }
                $scope.menu[value.id] = {};
                //$scope.
            });
            $scope.loadingRestaurantPackages = false;
        });
    };

    $scope.getRestaurantPackages();

    $scope.openPackage = function(id){
        $scope.isPackageCollapsed[id] = !$scope.isPackageCollapsed[id];
        //console.log(this.restaurantPackage);
        dataService.getMenuItem($scope.restaurantId,id).$promise.then(function(res){
            angular.forEach($scope.restaurantPackages,function(value,key){
                if(value.id == id){
                    value.packageDetails = res;
                }
            });
        });

    };

    $scope.openM = function(package_item,package1){
        if(package_item.has_options)
        $scope.open(package_item,package1,$rootScope.restaurantId);
    };

    $scope.selection = [];
    $scope.totalPrice = {};
    if($rootScope.searchDetails && $rootScope.searchDetails.pax)
    $scope.pax = $rootScope.searchDetails.pax;
    $scope.calculateTotalPrice = function(pkge){
        if($scope.numberOfPackages[pkge.id]){
        angular.forEach(pkge.pricing,function(value,key){
            if($scope.numberOfPackages[pkge.id] >= value.min_pax && $scope.numberOfPackages[pkge.id] <= value.max_pax){
               pkge.price = value.price_per_person;
            }
        });
            if($scope.totalAdditionalPrice[pkge.id]){
                $scope.totalPrice[pkge.id] = (pkge.price + $scope.totalAdditionalPrice[pkge.id] ) * $scope.numberOfPackages[pkge.id] ;}
            else{
                 $scope.totalPrice[pkge.id] = pkge.price * $scope.numberOfPackages[pkge.id] ;
            }
        }
    };

    $scope.totalAdditionalPrice = {};
    $scope.calculateAdditionalPrice = function(currentPackageId,additionalPrice){
        api.getRestaurantMenuItem.query({id: $scope.restaurantId},{menu_id : currentPackageId},function(res){
            $scope.totalAdditionalPrice[currentPackageId] = 0 ;
            angular.forEach(res,function(value,key){
                    $scope.totalAdditionalPrice[currentPackageId] += $scope.additionalPrice[value.id];
            });
        });

    };

    $scope.addOrder = function(restaurantPackage){
        $scope.selectedPackage = {};
        $scope.selectedItemOptionCategories = {};
        $scope.packageError = {};
        $scope.current_menu_item = {};
        angular.forEach(restaurantPackage.packageDetails,function(value,key){
            if(value.has_options){
                if($scope.package[value.id]){
                    $scope.selectedPackage[value.id] = $scope.package[value.id];
                    $scope.selectedItemOptionCategories[value.id] = $scope.itemOptionCategories[value.id];
                    $scope.current_menu_item[value.id] = $scope.menu_item[value.id];
                 }
                else
                {
                    $scope.selectedPackage[value.id] = "not Selected";
                    $scope.current_menu_item[value.id] = "not Selected";
                    $scope.packageError[value.id] = "You forgot this one!!";
                }
            }
            else {
                $scope.selectedPackage[value.id] = {};
                $scope.current_menu_item[value.id] = {};
                $scope.current_menu_item[value.id]['name'] = value.name;
            }
        });

        if($rootScope.searchDetails.selectedLocality && $rootScope.searchDetails.date && $rootScope.searchDetails.time){
            if(angular.equals({}, $scope.packageError)){
                if($scope.numberOfPackages[restaurantPackage.id] == undefined){
                    alertService.showAlert('lessPackageError',3000,'error');
                }
                else{
                    if($scope.totalAdditionalPrice[restaurantPackage.id] == undefined || isNaN($scope.totalAdditionalPrice[restaurantPackage.id]))
                    {
                        $scope.totalAdditionalPrice[restaurantPackage.id] = 0;
                    }
                    $scope.menu = {};
                    $scope.menu['id'] = restaurantPackage.id;
                    $scope.menu['name'] = restaurantPackage.name;
                    $scope.menu['price_per_package'] = restaurantPackage.price;
                    $scope.menu['order_package_count'] =  $scope.numberOfPackages[restaurantPackage.id];
                    if($scope.addInfo[restaurantPackage.id])
                        $scope.menu['additional_instruction'] = $scope.addInfo[restaurantPackage.id];
                    else
                        $scope.menu['additional_instruction'] = '';

                    $scope.menu['items'] = angular.copy($scope.current_menu_item);
                    orderService.addToBag($scope.restaurantDetails[0],$scope.menu);
                    //orderService.addOrder($scope.restaurantDetails[0],restaurantPackage,$scope.selectedItemOptionCategories,$scope.selectedPackage,$scope.totalAdditionalPrice[restaurantPackage.id],$scope.numberOfPackages[restaurantPackage.id],$scope.addInfo[restaurantPackage.id]);
                        $scope.isPackageCollapsed[restaurantPackage.id] = true;
                }
            }
        }
        else {
            if($rootScope.searchDetails.selectedLocality)
            {
                var modalInstance = $uibModal.open({
                    animation : true,
                    templateUrl : 'dateTime.html',
                    controller : 'dateTimeModalController',
                    size : 'md'
                });

                modalInstance.result.then(function(){
                    if(angular.equals({}, $scope.packageError)){
                        if($scope.numberOfPackages[restaurantPackage.id] == undefined){
                            alertService.showAlert('lessPackageError',3000,'error');
                        }
                        else{
                            if($scope.totalAdditionalPrice[restaurantPackage.id] == undefined)
                            {
                                $scope.totalAdditionalPrice[restaurantPackage.id] = 0;
                            }
                            $scope.menu = {};
                            $scope.menu['id'] = restaurantPackage.id;
                            $scope.menu['name'] = restaurantPackage.name;
                            $scope.menu['price_per_package'] = restaurantPackage.price;
                            $scope.menu['order_package_count'] =  $scope.numberOfPackages[restaurantPackage.id];
                            if($scope.addInfo[restaurantPackage.id])
                                $scope.menu['additional_instruction'] = $scope.addInfo[restaurantPackage.id];
                            else
                                $scope.menu['additional_instruction'] = '';
                            $scope.menu['items'] = angular.copy($scope.current_menu_item);
                            orderService.addToBag($scope.restaurantDetails[0],$scope.menu);
                            //orderService.addOrder($scope.restaurantDetails[0],restaurantPackage,$scope.selectedItemOptionCategories,angular.copy($scope.selectedPackage),$scope.totalAdditionalPrice[restaurantPackage.id],$scope.numberOfPackages[restaurantPackage.id],$scope.addInfo[restaurantPackage.id]);
                            $scope.isPackageCollapsed[restaurantPackage.id] = true;
                        }
                    }

                },function(){

                });



            }
            else
            {
                alertService.showAlert('NoLocality',3000,'error');

            }

        }
    };


    $scope.dynamicPopover = {
        content: 'Hello, World!',
        templateUrl: 'myPopoverTemplate.html',
        title: 'Title'
    };

    $scope.animationsEnabled = true;

    $scope.open = function (package_item,pre_package,restId) {
        console.log(package_item);
        console.log($scope.menu_item);
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'packageSelector.html',
            controller: 'packageSelectorModalController',
            size: 'md' ,
            resolve: {
                package_item : function(){
                    return angular.copy(package_item);
                },
                //pre_package : function(){
                //    return angular.copy(pre_package);
                //},
                selectedMenuItemOptions : function(){
                    return angular.copy($scope.menu_item);
                },
                restId : function(){
                    return restId;
                }
            }
        });


        modalInstance.result.then(function (result) {
            //console.log(result);
            $scope.package[package_item.id] = result.itemsSelected;
            var temp = {};
            temp['price_per_item'] = 0;
            temp['order_count'] = 0;
            temp['categories'] = {};
            temp['name'] = package_item.name;
            temp.categories[Object.keys(result.category)[0]] = result.category[Object.keys(result.category)[0]];
            $scope.menu_item[package_item.id] = temp;
            $scope.itemOptionCategories[package_item.id] = result.categoriesName;
            $scope.additionalPrice[package_item.id] = result.additionalPrice;
            $scope.calculateAdditionalPrice(package_item.menu_id,result.additionalPrice);
        }, function () {
        });
    };


});
app.controller('packageSelectorModalController',function($scope,$rootScope,$uibModalInstance,package_item,restId,api,alertService,dataService,selectedMenuItemOptions){
    $scope.animationsEnabled = true;
    $scope.selectedItem = {};
    $scope.count = {};
    $scope.max_choice = {};
    $scope.min_choice = {};
    $scope.selected = {};

    $scope.itemOptionCategoryList = [];
    $scope.package_item = package_item;

    //loading wheels
    $scope.loadingModal = true;


    $scope.countCheck = function(id,categoryId){
        if($scope.isChecked[id]){
            if($scope.count[categoryId] < $scope.max_choice[categoryId])
            {
                $scope.count[categoryId]++;
            }
            else{
                $scope.isChecked[id] = false;
                alertService.showAlert('moreThanMax',2000,'warning');
            }
        }
        else
        $scope.count[categoryId]--;
    };

    $scope.find = function(id,arrOb){
        angular.forEach(arrOb,function(value,key){
            return value.id == id;
        });
    };
    $scope.isChecked = {};

    $scope.getItemOptionCategories = function(){
        dataService.getItemOptionCategories(restId,$scope.package_item.menu_id,$scope.package_item.id).$promise.then(function(res){
            $scope.itemOptionCategories = res;
            //console.log(res);
            angular.forEach($scope.itemOptionCategories,function(value,key){
                dataService.getItemOptionList(restId,$scope.package_item.menu_id,$scope.package_item.id,value.id).$promise.then(function(res){
                    $scope.itemOptionCategoryList[value.id] = res;
                    if(selectedMenuItemOptions[$scope.package_item.id]){
                        $scope.count[value.id] = Object.keys(selectedMenuItemOptions[$scope.package_item.id].categories[value.id].options).length;
                        var temp = [];
                        angular.forEach($scope.itemOptionCategoryList[value.id],function(value1,key){
                            if(selectedMenuItemOptions[$scope.package_item.id].categories[value.id].options[value1.id]){
                                 $scope.isChecked[value1.id]  =  true;
                                 temp.push(value1);
                            }
                        });
                        $scope.selectedItem[value.id] = temp;
                    }
                    else{
                        $scope.selectedItem[value.id] = [];
                        $scope.count[value.id] = 0;
                        $scope.isChecked = {};
                    }
                    $scope.max_choice[value.id] = value.max_choice;
                    $scope.min_choice[value.id] = value.min_choice;
                });
                $scope.loadingModal = false;
            });
        });
    };

    $scope.getItemOptionCategories();
    $scope.addModalItem = function() {
        if(!angular.equals({}, $scope.selectedItem)) {
            $scope.additionalPrice = 0;
            //console.log();
            var temp = {};
            //temp[] = {};
                //console.log($scope.selectedItem[Object.keys($scope.selectedItem)[0]]);
            angular.forEach($scope.itemOptionCategories, function (value, key) {
                temp[value.id] = {};
                temp[value.id]['name'] = value.name;
                temp[value.id]['options'] = {};
                $scope.itemsSelected[value.id] = $scope.selectedItem[value.id];
                $scope.categoriesName[value.id] = value.name;
                angular.forEach($scope.selectedItem[value.id], function (value1, key) {
                    temp[value.id].options[value1.id] = {};
                    temp[value.id].options[value1.id]['price'] = value1.price;
                    temp[value.id].options[value1.id]['name'] = value1.name;
                    if (value1.price)
                        $scope.additionalPrice += value1.price;
                });
            });

            //console.log(temp);

            $uibModalInstance.close({
                'itemsSelected': $scope.itemsSelected,
                'categoriesName': $scope.categoriesName,
                'additionalPrice': $scope.additionalPrice,
                'category' : temp
            });
        }
    };

    $scope.add = function () {
        $scope.error = {};
        $scope.categoriesName = {};
        $scope.itemsSelected = {};
        angular.forEach($scope.itemOptionCategories,function(value,key){
            if($scope.count[value.id] < $scope.min_choice[value.id]) {
                //console.log(value);
                $scope.error[value.id] = 'You have to select at least ' + $scope.min_choice[value.id] + ' ' + value.name;
            }
            //$scope.error = "";
            //return false;
        });
        if(angular.equals({}, $scope.error)) {
            $scope.addModalItem();
        }
    };

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
    };
});
//app.controller('restaurantAlacarteController',function($scope, api,$rootScope,orderService){
//    $scope.quantity = {};
//    //loading wheel
//    $scope.loadingRestaurantAlacarte = true;
//
//
//    $scope.restaurantAlacartes = api.getRestaurantMenuPackage.query({id: $rootScope.restaurantId},{packages : 'a-la-carte'},function(){
//        angular.forEach($scope.restaurantAlacartes,function(value,key){
//            $scope.restaurantAlacartes[key].packageDetails = api.getRestaurantMenuItem.query({id: $rootScope.restaurantId},{menu_id : value.id},function(){
//                //console.log($scope.restaurantAlacartes[key].packageDetails);
//                $scope.loadingRestaurantAlacarte = false;
//            });
//        });
//    });
//
//    $scope.add = function(packageDetails,package_item){
//        orderService.addOrderAlacarte($scope.restaurantDetails[0],packageDetails,package_item,$scope.quantity[package_item.id]);
//    };
//
//
//});
app.controller('restaurantReviewsController',function($scope, api,$rootScope){
    //loading wheels
    $scope.loadingRestaurantReviews = true;
    $scope.getRestaurantReviews = function(){
        if(!$scope.restaurantReviews)
        {
            $scope.restaurantReviews = api.getRestaurantReviews.query({id: $rootScope.restaurantId},function(){
                $scope.loadingRestaurantReviews = false;
            });
        }
    };
    $scope.getRestaurantReviews();
});
//app.controller('restaurantPicturesController',function($scope, api,$rootScope){
//    //loading wheels
//    $scope.loadingRestaurantImages = true;
//    $scope.restaurantImages = api.getRestaurantImages.query({id: $rootScope.restaurantId},function(){
//        $scope.loadingRestaurantImages = false;
//    });
//});
