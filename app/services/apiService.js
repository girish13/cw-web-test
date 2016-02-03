app.service('api',function($resource,$http,baseUrl,$log,$location){

    //console.log($location.$$host);
    if($location.$$host == "www.caterwow.com"){
        baseUrl = 'http://www.caterwow.com/cw_api/public/api/v001/';
        //console.log(baseUrl);
    }
    else
    {
        baseUrl = 'http://caterwow.com/cw_api/public/api/v001/';
        //console.log(baseUrl);
    }


    //Restaurant Apis

    this.getRestaurant = $resource(baseUrl+'getRestaurant/:id',{id : '@id'});
    this.getTaxDetails = $resource(baseUrl+'getRestaurant/:id/tax',{id:'@id'});
    this.getRestaurantSchedule = $resource(baseUrl+'getRestaurant/:id/schedule',{id : '@id'});
    this.getRestaurantImages = $resource(baseUrl+'getRestaurant/:id/images',{id:'@id'});
    this.getRestaurantReviews = $resource(baseUrl + 'getRestaurant/:id/review',{id:'@id'});
    this.getRestaurantMenu = $resource(baseUrl+'getRestaurant/:id/menu',{id:'@id'});
    this.getRestaurantMenuPackage = $resource(baseUrl+'getRestaurant/:id/menu/:packages',{id:'@id',packages:'@packages'});
    this.getRestaurantMenuItem = $resource(baseUrl+'getRestaurant/:id/menu/:menu_id/menuItem',{id:'@id',menu_id : '@menu_id'});
    this.getRestaurantMenuItemOptionCategory = $resource(baseUrl+'getRestaurant/:id/menu/:menu_id/menuItem/:item_id/menuItemOptionCategory',{id:'@id',menu_item_id : '@menu_id',item_id : '@item_id'});
    this.getRestaurantMenuItemOptionList = $resource(baseUrl+'getRestaurant/:id/menu/:menu_id/menuItem/:item_id/menuItemOptionCategory/:menu_item_option_category/menuItemOptionList',{id:'@id',menu_item_id : '@menu_id',item_id : '@item_id',menu_item_option_category : '@menu_item_option_category'});


    //Location Apis

    this.getStates = $resource(baseUrl+'getLocation/states');
    this.getCities = $resource(baseUrl+'getLocation/state/:state_id/cities',{state_id : '@state_id'});
    this.getLocalities = $resource(baseUrl+'getLocation/state/:state_id/city/:city_id/localities',{state_id : '@state_id',city_id : '@city_id'});


    //search Apis

    this.searchRestaurants = $resource(baseUrl+'getRestaurantList',{locality_id : '@locality_id',date : '@date',time : '@time',pax : '@pax',sort : '@sort',page : '@page',filters : '@filters',price_max : '@price_max',price_min : '@price_min'});


    //filter Apis

    this.getFilters = $resource(baseUrl+'getFilters');
    this.getFilterTypes = $resource(baseUrl+'getFilters/getTypes');
    this.getFilterByType = $resource(baseUrl+'getFilters/getFilterByType/:filter_type',{filter_type : '@filter_type'});


    //this.order = $resource(baseUrl+'order',{isArray : true});
    this.order = $resource(baseUrl + 'order',{},{save: {method: 'POST' , isArray:true}});


    //utility apis


    this.getTime = $resource(baseUrl+'util/getOrderTimeList');


    //console.log($resource(baseUrl+'1/RestaurantDisplay').query());





});