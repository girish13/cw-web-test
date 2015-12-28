app.controller('hotelSearchController',function($filter,$scope,api,$stateParams,$rootScope){
    $scope.tags = [
    ];
    //$scope.loadTags = function(query) {
    //    return $http.get('/tags?query=' + query);
    //};
    if($rootScope.searchDetails){
        $scope.locality_id =  $rootScope.searchDetails.selectedLocality.id;
        $scope.date =  $filter('date')($rootScope.searchDetails.date,'yyyy/MM/dd');
        $scope.time = $rootScope.searchDetails.time;
        $scope.pax = $rootScope.searchDetails.pax;
    }
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
    $scope.restaurants = api.searchRestaurants.query({locality_id : $scope.locality_id,date : $scope.date,time : $scope.time ,pax : $scope.pax},function(){
        //console.log($scope.restaurants);
    });

     $scope.filterRestaurants = function() {
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
         console.log($scope.filter_string);

         $scope.restaurants = api.searchRestaurants.query({
             locality_id: $scope.locality_id,
             date: $scope.date,
             time: $scope.time,
             pax: $scope.pax,
             sort: $scope.sortType,
             page: $scope.pageNumber,
             filters:$scope.filter_string,
             price_max: $scope.price_max,
             price_min: $scope.price_min
         }, function () {
               console.log($scope.restaurants);
         });
     };




    $scope.filterTypes = api.getFilterTypes.query(function(){
        angular.forEach($scope.filterTypes,function(value,key){
            console.log(value);
            $scope.filters[value.type] = api.getFilterByType.query({filter_type : value.type},function(){
                //console.log($scope.filters[value.type]);
            });
        });
    });





});