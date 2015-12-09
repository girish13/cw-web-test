app.controller('hotelController',function($rootScope,$scope,$stateParams,api){

$rootScope.hotelId = $stateParams.id;
$scope.hotelDetails = api.getHotel.query({id : $rootScope.hotelId},function(){
    angular.forEach($scope.hotelDetails[0],function(value,key){
        $scope.hotel[key] = value;
    });
});
$scope.hotelSchedule = api.getHotelSchedule.query({id: $rootScope.hotelId},function(){
});



});


app.controller('hotelPackagesController',function($scope, $uibModal, $log, api,$rootScope){

    $scope.hotelPackages = api.getHotelMenuPackage.query({id: $rootScope.hotelId},{packages : 'package'},function(){
        angular.forEach($scope.hotelPackages,function(value,key){
            $scope.hotelPackages[key].packageDetails = api.getHotelMenuItem.query({id: $rootScope.hotelId},{menu_id : value.id},function(){
                console.log($scope.hotelPackages[key].packageDetails);
            });
        });
    });




    $scope.dynamicPopover = {
        content: 'Hello, World!',
        templateUrl: 'myPopoverTemplate.html',
        title: 'Title'
    };

    $scope.animationsEnabled = true;

    $scope.open = function (package_item) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'packageSelector.html',
            controller: 'packageSelectorModalController',
            size: 'lg' ,
            resolve: {
                package_item : function(){
                    return package_item;
                }
            }
        });


        modalInstance.result.then(function () {

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


});
app.controller('packageSelectorModalController',function($scope,$rootScope,$uibModalInstance,package_item,api){
    $scope.animationsEnabled = true;
    $scope.selectedItems = [];
    $scope.error = "";
    //console.log(selection.ids);


    $scope.countCheck = function(option,count){
        $scope.count = count;
        if(option.check)
        {
            $scope.count++;
        }
        else{
            $scope.count--;
        }
    };
    $scope.check = function(){

    };

    $scope.package_item = package_item;
    console.log($scope.package_item.id);
    $scope.itemOptions = api.getHotelMenuItemOptions.query({id:$rootScope.hotelId,menu_id : $scope.package_item.menu_id ,item_id : $scope.package_item.id},function(){
    });

    $scope.add = function () {
        console.log($scope.selectedItems);
        angular.forEach($scope.selectedItems[0],function(value,key){
            console.log(key + ','+value);
            angular.forEach(value,function(value1,key){
               $scope.checkMax[key] = console.log(value1.max_length);
                $scope.checkMin[key] = value1.min_length;
                $scope.checkCount[key] += 1;
            });
        });
        console.log($scope.checkMax);
        console.log($scope.checkMix);
        console.log($scope.checkCount);
        //$uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
app.controller('hotelAlacarteController',function($scope, api,$rootScope){

    $scope.hotelAlacartes = api.getHotelMenuPackage.query({id: $rootScope.hotelId},{packages : 'a-la-carte'},function(){

    });
});
app.controller('hotelReviewsController',function($scope, api,$rootScope){

});
app.controller('hotelPicturesController',function($scope, api,$rootScope){
    $scope.hotelImages = api.getHotelImages.query({id: $rootScope.hotelId},function(){

    });
});
