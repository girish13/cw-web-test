app.service('restaurantService',function($resource){

    var data = '{"restaurants" : [{"" : "" , "" : "" }, ' +
        '{"" : "" , "" : ""}, ' +
        '{"" : "" , "" : ""} ]}';

    this.getRestaurant = function(id){
        return data.id.restaurant ;
    };





});