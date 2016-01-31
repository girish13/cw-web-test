app.service('dataService',function(api,$rootScope,$filter){

    $rootScope.searchDetails = {
        selectedState : '3',
        selectedCity : '1',
        selectedLocality : '',
        pax : '',
        date : '',
        time : ''
    };

    this.taxDetails = {};
    this.filters = {};
    this.packages = {};
    this.getTimeList = function(){
        if(!this.timeList){
            return (this.timeList = api.getTime.query(function(res){
                return res;
            }));
        }
        else
        return this.timeList;
    };

    this.getLocalities = function(){
        if(!this.localities) {
           return ( this.localities =  api.getLocalities.query({
                state_id: $rootScope.searchDetails.selectedState,
                city_id: $rootScope.searchDetails.selectedCity
            },function(res){
            return res;
             }) );

        }
            else
             return this.localities;
    };

    this.getRestaurants = function(sortType,pageNumber,filter_string,price_max,price_min){
        return api.searchRestaurants.query({
            locality_id: $rootScope.searchDetails.selectedLocality.id,
            date: $filter('date')($rootScope.searchDetails.date,'yyyy/MM/dd'),
            time: $rootScope.searchDetails.time,
            pax: $rootScope.searchDetails.pax,
            sort: sortType,
            page: pageNumber,
            filters: filter_string,
            price_max: price_max,
            price_min: price_min
        });
    };

    this.getFilterTypes = function(){
        if(!this.filterTypes){
            return (this.filterTypes = api.getFilterTypes.query(function(res){
                return res;
            }));
        }
        else
            return this.filterTypes;
    };

    this.getFilters = function(type){
        if(!this.filters[type]){
            return (
                this.filters[type] = api.getFilterByType.query({filter_type : type},function(res){return res;
                })
            );
        }
        else
        return this.filters[type];
    };

    this.getRestaurantDetails = function(id){
        return api.getRestaurant.query({id : id},function(){});
    };

    this.getRestaurantPackages = function(id){
        if(!this.packages[id]) {
            return ( this.packages[id] =  api.getRestaurantMenuPackage.query({id: id},{packages : 'package'},function(res){
                return res;
            }) );

        }
        else
            return this.packages[id];

        //
        //return api.getRestaurantMenuPackage.query({id: id},{packages : 'package'},function(){
        //
        //});
    };

    this.getTaxDetails = function(id){
        if(!this.taxDetails[id]) {
            return ( this.taxDetails[id] =  api.getTaxDetails.query({id : id },function(res){
                return res;
            }) );

        }
        else
            return this.taxDetails[id];
    };

    //this.getTimeList();
    //this.getLocalities();



});