app.service('dataService',function(api,$rootScope,$filter){


    this.taxDetails = {};
    this.filters = {};
    this.packages = {};
    this.menuItem = {};
    this.itemOptionCategories = {};
    this.itemOptionList = {};
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
    };

    this.getPackagePricing = function(restId,packageId){
       if(this.packages[restId]){
           angular.forEach(this.packages[restId],function(value,key){
               if(value.id == packageId){
                   return value.pricing;
               }
           });
       }
    };


    this.getMenuItem = function(restId,packageId){
        if(!this.menuItem[packageId]){
            return(this.menuItem[packageId] = api.getRestaurantMenuItem.query({id: restId},{menu_id : packageId},function(res){
                return res;
            }));
        }
        else
            return this.menuItem[packageId];

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

    this.getItemOptionCategories = function(restaurantId,packageId,itemId){
        if(!this.itemOptionCategories[itemId]){
            return( this.itemOptionCategories[itemId] = api.getRestaurantMenuItemOptionCategory.query({id: restaurantId,menu_id : packageId ,item_id : itemId},function(res){
                return res;
            }) );
        }
        else
            return this.itemOptionCategories[itemId];
    };

    this.getItemOptionList = function(restaurantId,packageId,itemId,categoryId){
        if(!this.itemOptionList[categoryId]){
            return( this.itemOptionList[categoryId] = api.getRestaurantMenuItemOptionList.query({id: restaurantId,menu_id : packageId ,item_id : itemId,menu_item_option_category : categoryId},function(res){
                       return res;
                }) );
        }
        else
        return this.itemOptionList[categoryId];
    };
});