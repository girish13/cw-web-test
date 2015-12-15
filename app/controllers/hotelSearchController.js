app.controller('hotelSearchController',function($scope,api,$stateParams){
    $scope.tags = [
    ];
    //$scope.loadTags = function(query) {
    //    return $http.get('/tags?query=' + query);
    //};
    $scope.locality_id =  $stateParams.locality_id;
    $scope.date = $stateParams.date;
    $scope.time = $stateParams.mytime;
    $scope.pax = $stateParams.pax;
    $scope.filters = {};
    $scope.selectedFilters = [];
    $scope.restaurants = api.searchRestaurants.query({locality_id : $scope.locality_id,date : $scope.date,time : $scope.time ,pax : $scope.pax},function(){
        //console.log($scope.restaurants);
    });
    //
    // $scope.filterRestaurants = function() {
    //      $scope.restaurants = api.searchRestaurants.save({locality_id : $scope.locality_id,date : $scope.date,time : $scope.time,pax : $scope.pax,sort : $scope.sortType,page : $scope.pageNumber,filters : $scope.filters,price_max : $scope.price_max,price_min : $scope.price_min},function(){
    //
    //});

    $scope.filterTypes = api.getFilterTypes.query(function(){
        angular.forEach($scope.filterTypes,function(value,key){
            console.log(value);
            $scope.filters[value.type] = api.getFilterByType.query({filter_type : value.type},function(){
                //console.log($scope.filters[value.type]);
            });
        });
    });



});