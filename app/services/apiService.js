app.service('api',function($resource,$http,baseUrl,$log){

    this.getHotel = $resource(baseUrl+':id/RestaurantDisplay',{id : '@id'});
    this.getHotelSchedule = $resource(baseUrl+':id/RestaurantDisplay/schedule',{id : '@id'});
    this.getHotelImages = $resource(baseUrl+':id/RestaurantDisplay/images',{id:'@id'});
    this.getHotelMenu = $resource(baseUrl+':id/getRestaurantMenu',{id:'@id'});
    this.getHotelMenuPackage = $resource(baseUrl+':id/getRestaurantMenu/:packages',{id:'@id',packages:'@packages'});
    this.getHotelMenuItem = $resource(baseUrl+':id/getMenuItem/:menu_id',{id:'@id',menu_id : '@menu_id'});
    this.getHotelMenuItemOptions = $resource(baseUrl+':id/getMenuItemOptionAndList/:menu_id/:item_id',{id:'@id',menu_id : '@menu_id',item_id : '@item_id'});



    //console.log($resource(baseUrl+'1/RestaurantDisplay').query());





});