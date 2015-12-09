app.service('orderService',function(){
    this.addItem = function(item){

        $rootScope.order.push(item);

    };




});