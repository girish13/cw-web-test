app.service('api',function($resource,$http,baseUrl,$log){

    //Restaurant Apis

    this.getHotel = $resource(baseUrl+'getRestaurant/:id',{id : '@id'});
    this.getTaxDetails = $resource(baseUrl+'getRestaurant/:id/tax',{id:'@id'});
    this.getHotelSchedule = $resource(baseUrl+'getRestaurant/:id/schedule',{id : '@id'});
    this.getHotelImages = $resource(baseUrl+'getRestaurant/:id/images',{id:'@id'});
    this.getHotelReviews = $resource(baseUrl + 'getRestaurant/:id/review',{id:'@id'});
    this.getHotelMenu = $resource(baseUrl+'getRestaurant/:id/menu',{id:'@id'});
    this.getHotelMenuPackage = $resource(baseUrl+'getRestaurant/:id/menu/:packages',{id:'@id',packages:'@packages'});
    this.getHotelMenuItem = $resource(baseUrl+'getRestaurant/:id/menu/:menu_id/menuItem',{id:'@id',menu_id : '@menu_id'});
    this.getHotelMenuItemOptionCategory = $resource(baseUrl+'getRestaurant/:id/menu/:menu_id/menuItem/:item_id/menuItemOptionCategory',{id:'@id',menu_item_id : '@menu_id',item_id : '@item_id'});
    this.getHotelMenuItemOptionList = $resource(baseUrl+'getRestaurant/:id/menu/:menu_id/menuItem/:item_id/menuItemOptionCategory/:menu_item_option_category/menuItemOptionList',{id:'@id',menu_item_id : '@menu_id',item_id : '@item_id',menu_item_option_category : '@menu_item_option_category'});


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


    //console.log($resource(baseUrl+'1/RestaurantDisplay').query());





});