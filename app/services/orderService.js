app.service('orderService',function($rootScope){

    $rootScope.order = [];
    this.orderObject = [];

    this.addOrder = function(hotelDetails,packageDetails,itemOptionCategories,selectedItems,additionalPrice,numberOfPackages){
        this.order1 = [];
        this.order1.push($rootScope.custId);
        this.order1.push(hotelDetails);
        this.order1.push(packageDetails);
        this.order1.push(itemOptionCategories);
        this.order1.push(selectedItems);
        this.order1.push(additionalPrice);
        this.order1.push(numberOfPackages);
        $rootScope.order.push(this.order1);
        console.log($rootScope.order);
    };

    this.addOrderAlacarte = function(hotelDetails,packageDetails,package_item,numberOfPackages){
        this.order1 = [];
        this.order1.push($rootScope.custId);
        this.order1.push(hotelDetails);
        this.order1.push(packageDetails);
        this.order1.push(package_item);
        this.order1.push(numberOfPackages);
        $rootScope.order.push(this.order1);
        console.log($rootScope.order);
    };

    this.checkout = function(){
        this.orderObject.push($rootScope.custId);
        angular.forEach($rootScope.order,function(value,key){
            this.temp =  [];
            this.temp.push(value[1].restaurant_id);
            this.temp.push(value[2].id);
            if(value[2].type == "package")
            {
                console.log(value[4]);
                this.temp.push(value[4]);
                this.temp.push(parseInt(value[6],10));
            }
            else if(value[2].type == "a-la-carte"){
                this.temp.push(value[3].id);
                this.temp.push(parseInt(value[4],10));
            }
            this.orderObject.push(this.temp);
        },this);
 };

});