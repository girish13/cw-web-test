app.controller('hotelSearchController',function($filter,$scope,api,$stateParams,$rootScope,alertService){
    $scope.tags = [
    ];
    //loading spinners
    $scope.imagesPath = $rootScope.imagePath;
    $scope.loadingRestaurants = true;
    $scope.loadingFilters = {
        Cuisine : true,
        Other : true
    };
    $scope.isFilterChecked = {};
    $scope.isCollapsed = {};
    //$scope.loadTags = function(query) {
    //    return $http.get('/tags?query=' + query);
    //};
    $scope.filters = {};
    $scope.selectedFilters = [];
    $scope.sortTypes = ['popularity','rating','price-low','price-high'];
    $scope.sortType = 'popularity';
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
    $scope.restaurants = api.searchRestaurants.query({locality_id : $rootScope.searchDetails.selectedLocality.id,date : $filter('date')($rootScope.searchDetails.date,'yyyy/MM/dd'),time : $rootScope.searchDetails.time ,pax : $rootScope.searchDetails.pax},function(){
        //console.log($scope.restaurants);
        $scope.loadingRestaurants = false;
        $scope.$watch('selectedFilters',function(newVal,oldVal){
                //console.log("changed");
                $scope.filterRestaurants();
            },true
        );
        $scope.$watch('slider',function(newVal,oldVal){
                //console.log("changed");
                $scope.filterRestaurants();
            },true
        );
    });


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
         //console.log($scope.filter_string);
            if($rootScope.searchDetails.selectedLocality != ''){
                if($rootScope.searchDetails.selectedLocality.id){
                $scope.restaurants = api.searchRestaurants.query({
                    locality_id: $rootScope.searchDetails.selectedLocality.id,
                    date: $filter('date')($rootScope.searchDetails.date,'yyyy/MM/dd'),
                    time: $rootScope.searchDetails.time,
                    pax: $rootScope.searchDetails.pax,
                    sort: $scope.sortType,
                    page: $scope.pageNumber,
                    filters:$scope.filter_string,
                    price_max: $scope.price_max,
                    price_min: $scope.price_min
                }, function () {
                    $scope.loadingRestaurants = false;
                    //console.log($scope.restaurants);
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




    $scope.filterTypes = api.getFilterTypes.query(function(){
        angular.forEach($scope.filterTypes,function(value,key){
            //console.log(value);
            $scope.filters[value.type] = api.getFilterByType.query({filter_type : value.type},function(){
                //console.log($scope.filters[value.type]);
               $scope.loadingFilters[value.type] = false;
            });
        });
    });

    //$scope.$watchGroup(['sortType','selectedFilters','price_min','price_max'],$scope.filterRestaurants());
    //$scope.$watch('price_max',function(newVal,oldVal){
    //        //console.log("changed");
    //        $scope.filterRestaurants();
    //    }
    //);
});