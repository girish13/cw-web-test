app.controller('restaurantSearchController',function($filter,$scope,api,$stateParams,$rootScope,alertService,dataService,$state){
    $scope.tags = [];
    $scope.imagesPath = $rootScope.imagePath;
    $scope.loadingRestaurants = true;
    $scope.loadingFilters = {};
    $scope.isFilterChecked = {};
    $scope.isCollapsed = {};
    $scope.filters = {};
    $scope.selectedFilters = [];
    $scope.sortTypes = ['popularity','rating','price-low','price-high'];
    $scope.sortType = $scope.sortTypes[0];
    $scope.pageNumber = 1;
    $scope.price_min = 0;
    $scope.price_max = 2000;
    $scope.slider ={
      min : $scope.price_min,
      max : $scope.price_max,
        options : {
            floor : 0,
            ceil : 2000
        }
    };
    $scope.isFilterBoxCollapsed = true;
    $scope.isSearchBoxCollapsed = true;



    $scope.getRestaurants = function(){
        dataService.getRestaurants().$promise.then(function(res){
                    $scope.restaurants = res;
                    $scope.loadingRestaurants = false;
                    $scope.$watch('selectedFilters',function(newVal,oldVal){
                            if(newVal != oldVal)
                            $scope.filterRestaurants();
                        },true
                    );
                    $scope.$watch('slider',function(newVal,oldVal){
                            if(newVal != oldVal)
                                $scope.filterRestaurants();
                        },true
                    );
            });
    };


    $scope.removeFilter = function(ob){
        $scope.isFilterChecked[ob.filter.id] = false;
        var index = $scope.selectedFilters.indexOf(ob.filter);
        $scope.selectedFilters.splice(index, 1);

    };

     $scope.clearFilters = function(){
        $scope.selectedFilters = [];
         $scope.isFilterChecked = {};
         $scope.slider.min = 0;
         $scope.slider.max = 2000;
     };


     $scope.filterRestaurants = function() {
         $scope.loadingRestaurants = true;
         $scope.price_max = $scope.slider.max;
         $scope.price_min = $scope.slider.min;
         $scope.filter_string = null;

         angular.forEach($scope.selectedFilters,function(value,key){
             if($scope.filter_string){
                    $scope.filter_string += ',' + value.id;
                }
             else {
                    $scope.filter_string = value.id;
                }
         });
            if($rootScope.searchDetails.selectedLocality != ''){
                if($rootScope.searchDetails.selectedLocality.id){
                    dataService.getRestaurants($scope.sortType,$scope.pageNumber,$scope.filter_string,$scope.price_max,$scope.price_min).$promise.then(function(res){
                            $scope.restaurants = res;
                            $scope.loadingRestaurants = false;

                    });
                }
            }
            else if($rootScope.searchDetails.selectedLocality == '') {
                alertService.showAlert('noLocationError',3000,'error');
            }
            else
            {
                alertService.showAlert('locationInvalid',3000,'error')
            }

     };


    $scope.getFilterTypes = function(){
        if(!$scope.filterTypes){
            dataService.getFilterTypes().$promise.then(function(res){
                $scope.filterTypes = res;
                angular.forEach($scope.filterTypes,function(value,key){
                    $scope.loadingFilters[value.type] = true;
                    if(!$scope.filters[value.type]){
                        dataService.getFilters(value.type).$promise.then(function(res){
                            $scope.filters[value.type] = res;
                            //console.log(res);
                            $scope.loadingFilters[value.type] = false;
                        });
                    }
                });
            });
        }
    };

    $scope.openFilters = function(){
        $scope.isFilterBoxCollapsed = false;
    };
    $scope.closeFilterBox = function(){
        $scope.isFilterBoxCollapsed = true;
    };
    $scope.openSearch = function(){
        $scope.isSearchBoxCollapsed = false;
    };







    //location search Controller


    $scope.datePickerStatus = {
        opened: false
    };




    $scope.getTimeList = function(){
        if(!$scope.times){
           dataService.getTimeList().$promise.then(function(res){
                $scope.times = res;
            });
        }
    };


    $scope.openDatePicker = function($event) {
        $scope.datePickerStatus.opened = true;
    };



    $scope.getLocalities = function(){
        if(!$scope.localities){
            dataService.getLocalities().$promise.then(function(res){
                //console.log(res);
                $scope.localities = res;
            });
        }
    };

    $scope.setDate = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        $scope.maxDate = new Date(yyyy, mm, (dd+90) );
        $scope.minDate = new Date(yyyy, mm, (dd+1));

    };
    //
    //$scope.getStarted =function(){
    //    if($rootScope.searchDetails.selectedLocality.id){
    //        dataService.getRestaurants().$promise.then(function(res){
    //            console.log('here');
    //            $scope.restaurants = res;
    //            $scope.$watch('selectedFilters',function(newVal,oldVal){
    //                    $scope.filterRestaurants();
    //                },true
    //            );
    //            $scope.$watch('slider',$scope.filterRestaurants(),true);
    //            console.log($scope.restaurants);
    //            $state.go('search');
    //            $scope.loadingRestaurants = false;
    //            console.log('after search');
    //        });
    //    }
    //    else if($rootScope.searchDetails.selectedLocality == '') {
    //        alertService.showAlert('noLocationError',3000,'error');
    //    }
    //    else
    //    {
    //        alertService.showAlert('locationInvalid',3000,'error')
    //    }
    //};



    $scope.getTimeList();
    $scope.getLocalities();
    $scope.setDate();
    $scope.getFilterTypes();
    $scope.getRestaurants();

});