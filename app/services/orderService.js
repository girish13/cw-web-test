app.service('orderService',function($rootScope,api){

    $rootScope.order = [];
    $rootScope.total = {};
    this.orderObject = [];
    //this.totalAmount = totalAmount;
    //this.totalTax = totalTax;
    //this.subTotal = subTotal;
    this.addOrder = function(hotelDetails,packageDetails,itemOptionCategories,selectedItems,additionalPrice,numberOfPackages,addInfo){
        //this.order1 = [];
        var order1 = [];
        order1.push($rootScope.custId);
        order1.push(hotelDetails);
        order1.push(packageDetails);
        order1.push(itemOptionCategories);
        order1.push(selectedItems);
        order1.push(additionalPrice);
        order1.push(numberOfPackages);
        order1.push(addInfo);
        var price = 0;
        angular.forEach(packageDetails.pricing,function(value,key){
            if(numberOfPackages >= value.min_pax && numberOfPackages<= value.max_pax){
                 price = value.price_per_person;
                 packageDetails.price = price;
            }
        });
        price += additionalPrice;
        price = price * numberOfPackages;
        var taxDetails = api.getTaxDetails.query({id : hotelDetails.id },function(){
            order1.push(taxDetails);
            angular.forEach(taxDetails[0],function(value,key){
                price += value * price;
            });
            order1.push(Math.round(price));
            $rootScope.order.push(order1);
            //calculateTotalPrice();
            var totalAmount = 0;
            var totalTax = 0;
            var subTotal = 0;
            console.log($rootScope.order);
            angular.forEach($rootScope.order,function(value,key){
                        //console.log(value);
                        //console.log(value[6]);
                        console.log(value);
                        subTotal += (value[2].price * value[6]);
                        totalAmount += value[9];
                        totalTax += (value[9] - (value[2].price * value[6]));
                    });
            $rootScope.total = {};
            $rootScope.total['subTotal'] = subTotal;
            $rootScope.total['totalAmount'] = totalAmount;
            $rootScope.total['totalTax'] = totalTax;

        });
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

    this.checkout = function(cust){
        this.orderObject.push(cust);
        angular.forEach($rootScope.order,function(value,key){
            this.temp =  [];
            this.temp.push(value[1].id);
            this.temp.push(value[2].id);
            if(value[2].type == "package")
            {
                console.log(value[4]);
                this.temp.push(value[4]);
                this.temp.push(parseInt(value[6],10));
                this.temp.push(value[7]);
            }
            else if(value[2].type == "a-la-carte"){
                this.temp.push(value[3].id);
                this.temp.push(parseInt(value[4],10));
            }
            this.orderObject.push(this.temp);
        },this);
        this.orderObject.push($rootScope.searchDetails);
        console.log(this.orderObject);

         api.order.save(this.orderObject);

 };

    //this.calculateTotalPrice = function(){
    //    angular.forEach($rootScope.order,function(value,key){
    //        console.log(value);
    //        console.log(value[6]);
    //        this.subTotal += value[2].price;
    //        this.totalAmount += value[9];
    //        this.totalTax += (value[9] - value[2].price);
    //    },this);
    //    console.log(this.subTotal);
    //    console.log(this.totalAmount);
    //    console.log(this.totalTax);
    //};
});