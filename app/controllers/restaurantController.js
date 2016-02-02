app.controller('restaurantController',function($rootScope,$scope,$stateParams,api,dataService){
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
    //loading wheels

    $scope.getRestaurantPackages = function(){
        $scope.loadingRestaurantPackages = true;
        dataService.getRestaurantPackages($scope.restaurantId).$promise.then(function(res){
            $scope.restaurantPackages = res;
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
                //console.log($scope.restaurantPackages);
                //$scope.restaurantPackages[key].packageDetails = api.getRestaurantMenuItem.query({id: $scope.restaurantId},{menu_id : value.id},function(){
                //                $scope.loadingRestaurantPackages = false;
                //            });
            });
            $scope.loadingRestaurantPackages = false;
        });
    };

    //$scope.getPaxs = function(){
        $scope.getRestaurantPackages();
    //};

    $scope.openPackage = function(id){
        $scope.isPackageCollapsed[id] = !$scope.isPackageCollapsed[id];
        if(!this.restaurantPackage.packageDetails){
                this.restaurantPackage.packageDetails = api.getRestaurantMenuItem.query({id: $scope.restaurantId},{menu_id : id},function(){
                        $scope.loadingPackage[id] = false;
                });
        }
    };



    //
    //$scope.restaurantPackages = api.getRestaurantMenuPackage.query({id: $rootScope.restaurantId},{packages : 'package'},function(){
    //    angular.forEach($scope.restaurantPackages,function(value,key){
    //        if(value.pricing.length == 1){
    //            value.price = value.pricing[0].price_per_person;
    //        }
    //        else if($rootScope.searchDetails && $rootScope.searchDetails.pax){
    //            angular.forEach(value.pricing,function(value1,key){
    //               if($rootScope.searchDetails.pax >= value1.min_pax && $rootScope.searchDetails.pax <=  value1.max_pax){
    //                   value.price = value1.price_per_person;
    //               }
    //            });
    //        }
    //        else{
    //            value.price_min = value.pricing[0].price_per_person;
    //            value.price_max = value.pricing[value.pricing.length - 1].price_per_person;
    //        }
    //
    //    });
    //});

    $scope.openM = function(package_item,package1){
        if(package_item.has_options)
        $scope.open(package_item,package1);
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
                //if($scope.totalAdditionalPrice[currentPackageId]){

                    //if($scope.totalAdditionalPrice[currentPackageId] < 25)
                    //$scope.totalAdditionalPrice[currentPackageId] += additionalPrice;
                    //console.log($scope.totalAdditionalPrice[currentPackageId]);
                    //console.log($scope.additionalPrice[value.id]);
                    $scope.totalAdditionalPrice[currentPackageId] += $scope.additionalPrice[value.id];
                //}
                //else {
                //    $scope.totalAdditionalPrice[currentPackageId] = 0;
                //    $scope.totalAdditionalPrice[currentPackageId] += $scope.additionalPrice[value.id];
                //    //$scope.totalAdditionalPrice[currentPackageId] += additionalPrice;
                //}
            });
        });

    };

    $scope.addOrder = function(restaurantPackage){
        $scope.selectedPackage = {};
        $scope.selectedItemOptionCategories = {};
        $scope.packageError = {};
        //$scope.totalAdditionalPrice = 0;
        angular.forEach(restaurantPackage.packageDetails,function(value,key){
            if(value.has_options){
                //console.log($scope.package);
                //console.log($scope.package[value.id]);
                //console.log($scope.package[value.id][value.id]);
                if($scope.package[value.id]){
                    $scope.selectedPackage[value.id] = $scope.package[value.id];
                    //$scope.totalAdditionalPrice += $scope.additionalPrice[value.id];
                    $scope.selectedItemOptionCategories[value.id] = $scope.itemOptionCategories[value.id];
                }
                else
                {
                    $scope.selectedPackage[value.id] = "not Selected";
                    $scope.packageError[value.id] = "You forgot this one!!";
                }
            }
            else {
                $scope.selectedPackage[value.id] = {};
            }
        });

        if($rootScope.searchDetails.selectedLocality && $rootScope.searchDetails.date && $rootScope.searchDetails.time){
            if(angular.equals({}, $scope.packageError)){
                //console.log($scope.numberOfPackages[restaurantPackage.id]);
                if($scope.numberOfPackages[restaurantPackage.id] == undefined){
                    alertService.showAlert('lessPackageError',3000,'error');
                }
                else{
                    if($scope.totalAdditionalPrice[restaurantPackage.id] == undefined)
                    {
                        $scope.totalAdditionalPrice[restaurantPackage.id] = 0;
                    }
                    //console.log($scope.totalAdditionalPrice[restaurantPackage.id]);
                    orderService.addOrder($scope.restaurantDetails[0],restaurantPackage,$scope.selectedItemOptionCategories,$scope.selectedPackage,$scope.totalAdditionalPrice[restaurantPackage.id],$scope.numberOfPackages[restaurantPackage.id],$scope.addInfo[restaurantPackage.id]);
                        $scope.isPackageCollapsed[restaurantPackage.id] = true;
                }
            }
        }
        else {
            if($rootScope.searchDetails.selectedLocality)
            {
                //alertService.showAlert('NoDateTime',3000,'error');

                var modalInstance = $uibModal.open({
                    animation : true,
                    templateUrl : 'dateTime.html',
                    controller : 'dateTimeModalController',
                    size : 'md'
                });

                modalInstance.result.then(function(){
                    if(angular.equals({}, $scope.packageError)){
                        //console.log($scope.numberOfPackages[restaurantPackage.id]);
                        if($scope.numberOfPackages[restaurantPackage.id] == undefined){
                            alertService.showAlert('lessPackageError',3000,'error');
                        }
                        else{
                            if($scope.totalAdditionalPrice[restaurantPackage.id] == undefined)
                            {
                                $scope.totalAdditionalPrice[restaurantPackage.id] = 0;
                            }
                            //console.log($scope.totalAdditionalPrice[restaurantPackage.id]);
                            orderService.addOrder($scope.restaurantDetails[0],restaurantPackage,$scope.selectedItemOptionCategories,$scope.selectedPackage,$scope.totalAdditionalPrice[restaurantPackage.id],$scope.numberOfPackages[restaurantPackage.id],$scope.addInfo[restaurantPackage.id]);
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

    $scope.open = function (package_item,pre_package) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'packageSelector.html',
            controller: 'packageSelectorModalController',
            size: 'md' ,
            resolve: {
                package_item : function(){
                    return angular.copy(package_item);
                },
                pre_package : function(){
                    return angular.copy(pre_package);
                }
            }
        });


        modalInstance.result.then(function (result) {
            //$scope.itemsSelected = itemsSelected;
            //console.log(package_item);
            $scope.package[package_item.id] = result.itemsSelected;
            $scope.itemOptionCategories[package_item.id] = result.categoriesName;
            //console.log($scope.additionalPrice);
            //console.log($scope.additionalPrice[package_item.id]);
            //console.log($scope.additionalPrice);
            //if($scope.additionalPrice[package_item.id])
            //{
            //    if(result.additionalPrice > $scope.additionalPrice[package_item.id]){
            //        $scope.additionalPrice[package_item.id] = result.additionalPrice;
            //        $scope.calculateAdditionalPrice(package_item.menu_id,additionalPrice);
            //    }
            //    else if(result.additionalPrice = $scope.additionalPrice[package_item.id]) {
            //        //do nothing
            //    }
            //    else {
            //        $scope.additionalPrice[package_item.id] = result.additionalPrice;
            //
            //    }
            //}
            //else {
                $scope.additionalPrice[package_item.id] = result.additionalPrice;
                $scope.calculateAdditionalPrice(package_item.menu_id,result.additionalPrice);
            //}
            //console.log($scope.package[package_item.id]);
            //$scope.temp = [];
            //$scope.temp.push($scope.package);
            //
            //$scope.selectedPackage[package_item.menu_id] =

        }, function () {

            //$log.info('Modal closed at: ' + new Date());
        });
    };


});
app.controller('packageSelectorModalController',function($scope,$rootScope,$uibModalInstance,package_item,pre_package,api,alertService){
    $scope.animationsEnabled = true;
    $scope.selectedItem = {};
    //console.log(selection.ids);
    $scope.count = {};
    $scope.max_choice = {};
    $scope.min_choice = {};
    $scope.selected = {};

    $scope.itemOptionCategoryList = [];
    //var p_package = pre_package;
    $scope.pre_package = pre_package;
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
    $scope.itemOptionCategories = api.getRestaurantMenuItemOptionCategory.query({id:$rootScope.restaurantId,menu_id : $scope.package_item.menu_id ,item_id : $scope.package_item.id},function(){
                angular.forEach($scope.itemOptionCategories,function(value,key){
                    $scope.itemOptionCategoryList[value.id] = api.getRestaurantMenuItemOptionList.query({id:$rootScope.restaurantId,menu_id : $scope.package_item.menu_id ,item_id : $scope.package_item.id,menu_item_option_category : value.id},function(){

                        if($scope.pre_package[$scope.package_item.id]){
                                $scope.selectedItem[value.id] = $scope.pre_package[$scope.package_item.id][value.id];
                                $scope.count[value.id] = $scope.pre_package[$scope.package_item.id][value.id].length;
                                angular.forEach($scope.itemOptionCategoryList[value.id],function(value1,key){
                                    angular.forEach($scope.selectedItem[value.id],function(value2,key){
                                        if(value1.id == value2.id){
                                            $scope.isChecked[value1.id]  =  true;
                                        }
                                    });
                                });
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

    $scope.addModalItem = function() {
        if(!angular.equals({}, $scope.selectedItem)) {
            $scope.additionalPrice = 0;
            angular.forEach($scope.itemOptionCategories, function (value, key) {
                $scope.itemsSelected[value.id] = $scope.selectedItem[value.id];
                $scope.categoriesName[value.id] = value.name;
                angular.forEach($scope.selectedItem[value.id], function (value1, key) {
                    if (value1.price)
                        $scope.additionalPrice += value1.price;
                });
            });


            $uibModalInstance.close({
                'itemsSelected': $scope.itemsSelected,
                'categoriesName': $scope.categoriesName,
                'additionalPrice': $scope.additionalPrice
            });
        }
    };

    $scope.add = function () {
        $scope.error = {};
        $scope.categoriesName = {};
        //console.log($scope.selectedItem);
        $scope.itemsSelected = {};
        //$scope.itemsSelected.push($scope.package_item.id);

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
            //do something
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
