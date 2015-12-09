app.service('hotelService',function($resource){

    var data = '{"hotels" : [{"" : "" , "" : "" }, ' +
        '{"" : "" , "" : ""}, ' +
        '{"" : "" , "" : ""} ]}';

    this.getHotel = function(id){
        return data.id.hotel ;
    };





});