app.controller('hotelController',function($rootScope,$scope,$stateParams,api){
    $rootScope.custId = 0; // to be removed
    $scope.imagesPath = $rootScope.imagePath;
$rootScope.hotelId = $stateParams.id;
$scope.hotelDetails = api.getHotel.query({id : $rootScope.hotelId},function(){
    angular.forEach($scope.hotelDetails[0],function(value,key){
        $scope.hotel[key] = value;
    });
});
$scope.hotelSchedule = api.getHotelSchedule.query({id: $rootScope.hotelId},function(){
});



});


app.controller('hotelPackagesController',function($scope, $uibModal, $log, api,$rootScope,orderService){

    $scope.package = {};
    $scope.itemOptionCategories = {};
    $scope.additionalPrice = {};
    $scope.numberOfPackages = {};
    $scope.addInfo = {};
    $scope.isPackageCollapsed = {};


    //loading wheels
    $scope.loadingRestaurantPackages = true;

    $scope.hotelPackages = api.getHotelMenuPackage.query({id: $rootScope.hotelId},{packages : 'package'},function(){
        angular.forEach($scope.hotelPackages,function(value,key){
            if(value.pricing.length == 1){
                value.price = value.pricing[0].price_per_person;
                //console.log();
            }
            else if($rootScope.searchDetails && $rootScope.searchDetails.pax){
                angular.forEach(value.pricing,function(value1,key){
                   if($rootScope.searchDetails.pax >= value1.min_pax && $rootScope.searchDetails.pax <=  value1.max_pax){
                       value.price = value1.price_per_person;
                   }
                });
            }
            else{
                value.price_min = value.pricing[0].price_per_person;
                value.price_max = value.pricing[value.pricing.length - 1].price_per_person;
            }
            $scope.hotelPackages[key].packageDetails = api.getHotelMenuItem.query({id: $rootScope.hotelId},{menu_id : value.id},function(){
                $scope.loadingRestaurantPackages = false;
            });
        });
    });

    $scope.openM = function(package_item,package){
        if(package_item.has_options)
        $scope.open(package_item,package);
    };

    $scope.selection = [];
    //
    //angular.forEach($scope.hotelPackages,function(value,key){
    //   angular.forEach(value.packageDetails,function(value,key){
    //       console.log(value.id);
    //   });
    //});
    $scope.totalPrice = {};
    if($rootScope.searchDetails && $rootScope.searchDetails.pax)
    $scope.pax = $rootScope.searchDetails.pax;
    //$scope.numberOfPackages[hotelPackage.id]
    //$scope.totalPrice = {};
    $scope.calculateTotalPrice = function(pkge){
        if($scope.numberOfPackages[pkge.id]){
        angular.forEach(pkge.pricing,function(value,key){
            if($scope.numberOfPackages[pkge.id] >= value.min_pax && $scope.numberOfPackages[pkge.id] <= value.max_pax){
               pkge.price = value.price_per_person;
            }
        });
            if($scope.totalAdditionalPrice[pkge.id]){
                //console.log($scope.totalAdditionalPrice);
                //console.log(pkge.id);
                //console.log($scope.totalAdditionalPrice[pkge.id]);
            $scope.totalPrice[pkge.id] = (pkge.price + $scope.totalAdditionalPrice[pkge.id] ) * $scope.numberOfPackages[pkge.id] ;}
            else{
            console.log($scope.totalAdditionalPrice[pkge.id]);
             $scope.totalPrice[pkge.id] = pkge.price * $scope.numberOfPackages[pkge.id] ;
            }
        //console.log($scope.numberOfPackages[pkge.id]);
        //if(pkge.price){
        //    $scope.totalPrice[pkge.id] = pkge.price * $scope.numberOfPackages[pkge.id] +
        //}
        }
    };

    $scope.totalAdditionalPrice = {};
    $scope.calculateAdditionalPrice = function(currentPackageId,additionalPrice){
        //console.log(currentPackageId);
        //console.log($scope.hotelPackages);
        //console.log($scope.hotelPackages[currentPackageId]);
        //angular.forEach($s,)
        if($scope.totalAdditionalPrice.currentPackageId){
        $scope.totalAdditionalPrice[currentPackageId] += additionalPrice;
        }
        else {
            $scope.totalAdditionalPrice[currentPackageId] = 0 ;
            $scope.totalAdditionalPrice[currentPackageId] += additionalPrice;
        }
    };

    $scope.addOrder = function(hotelPackage){
        //console.log($scope.itemOptionCategories);
        $scope.selectedPackage = {};
        $scope.selectedItemOptionCategories = {};
        $scope.packageError = {};
        //$scope.totalAdditionalPrice = 0;
        angular.forEach(hotelPackage.packageDetails,function(value,key){
            if(value.has_options){
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
        //console.log($scope.selectedPackage);
        if(angular.equals({}, $scope.packageError)){
            orderService.addOrder($scope.hotelDetails[0],hotelPackage,$scope.selectedItemOptionCategories,$scope.selectedPackage,$scope.totalAdditionalPrice[hotelPackage.id],$scope.numberOfPackages[hotelPackage.id],$scope.addInfo[hotelPackage.id]);
        }

        //angular.forEach($scope.package);
        //console.log(hotelPackage);
        //$scope.order_package = {};
        //$scope.order_package[hotelPackage] = $scope.package;
        //$scope.order_package.push();
        //console.log()
        //console.log($scope.hotelDetails);
        //console.log($scope.order_package);
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
                    return package_item;
                },
                pre_package : function(){
                    return pre_package;
                }
            }
        });


        modalInstance.result.then(function (result) {
            //$scope.itemsSelected = itemsSelected;
            //console.log(package_item);
            $scope.package[package_item.id] = result.itemsSelected;
            $scope.itemOptionCategories[package_item.id] = result.categoriesName;
            $scope.additionalPrice[package_item.id] = result.additionalPrice;
            //console.log($scope.additionalPrice);
            $scope.calculateAdditionalPrice(package_item.menu_id,result.additionalPrice);
            //console.log($scope.package[package_item.id]);
            //$scope.temp = [];
            //$scope.temp.push($scope.package);
            //
            //$scope.selectedPackage[package_item.menu_id] =

        }, function () {
            $log.info('Modal closed at: ' + new Date());
        });
    };


});
app.controller('packageSelectorModalController',function($scope,$rootScope,$uibModalInstance,package_item,pre_package,api){
    $scope.animationsEnabled = true;
    $scope.selectedItem = {};
    //console.log(selection.ids);
    $scope.count = {};
    $scope.max_choice = {};
    $scope.min_choice = {};
    $scope.selected = {};

    $scope.itemOptionCategoryList = [];
    $scope.pre_package = pre_package;
    $scope.package_item = package_item;

    //loading wheels
    $scope.loadingModal = true;


    $scope.countCheck = function(id,categoryId){
        if($scope.isChecked[id]){
            if($scope.count[categoryId] < $scope.max_choice[categoryId])
            $scope.count[categoryId]++;
            else
                $scope.isChecked[id] = false;
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
    $scope.itemOptionCategories = api.getHotelMenuItemOptionCategory.query({id:$rootScope.hotelId,menu_id : $scope.package_item.menu_id ,item_id : $scope.package_item.id},function(){
                //console.log($scope.itemOptionCategories);
                angular.forEach($scope.itemOptionCategories,function(value,key){
                    $scope.itemOptionCategoryList[value.id] = api.getHotelMenuItemOptionList.query({id:$rootScope.hotelId,menu_id : $scope.package_item.menu_id ,item_id : $scope.package_item.id,menu_item_option_category : value.id},function(){

                        if($scope.pre_package[$scope.package_item.id]){
                                $scope.selectedItem[value.id] = $scope.pre_package[$scope.package_item.id][value.id];
                                $scope.count[value.id] = $scope.pre_package[$scope.package_item.id][value.id].length;
                            //console.log($scope.selectedItem[value.id]);
                            //    console.log($scope.itemOptionCategoryList[value.id]);
                                //console.log($scope.selectedItem[value.id]);
                                angular.forEach($scope.itemOptionCategoryList[value.id],function(value1,key){
                                    //console.log(value1);
                                    //console.log($scope.selectedItem[value.id]);
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


                        //console.log(value);
                        $scope.max_choice[value.id] = value.max_choice;
                        $scope.min_choice[value.id] = value.min_choice;
                        //else
                        //$scope.count[value.id] =
                         //console.log($scope.itemOptionCategoryList);
                    });
                    $scope.loadingModal = false;
                });
        ////console.log($scope.itemOptionCategoryList);
        //if($scope.pre_package[$scope.package_item.id]) {
        //    angular.forEach($scope.itemOptionCategoryList, function (value, key) {
        //        console.log(value);
        //        angular.forEach(value,function(value1, key){
        //            console.log(key +',' +value1);
        //            //console.log($scope.selectedItem[value2.id]);
        //            //$scope.isChecked[value2.id] = find(value2.id, $scope.selectedItem[value.id]);
        //        },value);
        //    });
        //}
    });

    $scope.addModalItem = function() {
        $scope.additionalPrice = 0;
        angular.forEach($scope.itemOptionCategories, function (value, key) {
                $scope.itemsSelected[value.id] = $scope.selectedItem[value.id];
                $scope.categoriesName[value.id] = value.name;
                angular.forEach($scope.selectedItem[value.id],function(value1,key){
                    if(value1.price)
                    $scope.additionalPrice += value1.price;
                });
        });



        $uibModalInstance.close({
            'itemsSelected': $scope.itemsSelected,
            'categoriesName': $scope.categoriesName,
            'additionalPrice' : $scope.additionalPrice
        });
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
app.controller('hotelAlacarteController',function($scope, api,$rootScope,orderService){
    $scope.quantity = {};
    //loading wheel
    $scope.loadingRestaurantAlacarte = true;


    $scope.hotelAlacartes = api.getHotelMenuPackage.query({id: $rootScope.hotelId},{packages : 'a-la-carte'},function(){
        angular.forEach($scope.hotelAlacartes,function(value,key){
            $scope.hotelAlacartes[key].packageDetails = api.getHotelMenuItem.query({id: $rootScope.hotelId},{menu_id : value.id},function(){
                //console.log($scope.hotelAlacartes[key].packageDetails);
                $scope.loadingRestaurantAlacarte = false;
            });
        });
    });

    $scope.add = function(packageDetails,package_item){
        orderService.addOrderAlacarte($scope.hotelDetails[0],packageDetails,package_item,$scope.quantity[package_item.id]);
    };


});
app.controller('hotelReviewsController',function($scope, api,$rootScope){
    //loading wheels
    $scope.loadingRestaurantReviews = true;
    $scope.hotelReviews = api.getHotelReviews.query({id: $rootScope.hotelId},function(){
        $scope.loadingRestaurantReviews = false;
    });
});
app.controller('hotelPicturesController',function($scope, api,$rootScope){
    //loading wheels
    $scope.loadingRestaurantImages = true;
    $scope.hotelImages = api.getHotelImages.query({id: $rootScope.hotelId},function(){
        $scope.loadingRestaurantImages = false;
    });
});
