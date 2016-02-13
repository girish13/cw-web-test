app.service('orderService',function($rootScope,api,dataService){
    $rootScope.order = [];
    $rootScope.total = {};
    this.orderObject = {};
    this.bag = {};
    this.bag['restaurants'] = {};
    this.addOrder = function(restaurantDetails,packageDetails,itemOptionCategories,selectedItems,additionalPrice,numberOfPackages,addInfo){
        var order1 = [];
        order1.push($rootScope.custId);
        order1.push(restaurantDetails);
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
        if(!isNaN(additionalPrice)){
            price += additionalPrice;
        }
        else {
            additionalPrice = 0;
        }
        price = price * numberOfPackages;
        dataService.getTaxDetails(restaurantDetails.id).$promise.then(function(result){
            var taxDetails = result;
            order1.push(taxDetails);
            angular.forEach(taxDetails[0],function(value,key){
                if(value > 0)
                    price += value * price;
            });
            order1.push(Math.round(price));
            $rootScope.order.push(order1);
            //calculateTotalPrice();
            var totalAmount = 0;
            var totalTax = 0;
            var subTotal = 0;
            //console.log($rootScope.order);
            angular.forEach($rootScope.order,function(value,key){
                //console.log(value);
                if(isNaN(value[5]))
                {
                    value[5] = 0;
                }
                if(!isNaN(value[5]))
                subTotal += ((value[2].price + value[5]) * value[6]);
                else
                    subTotal += ((value[2].price) * value[6]);
                totalAmount += value[9];
                if(!isNaN(value[5]))
                    totalTax += (value[9] - ((value[2].price + value[5])  *  value[6]));
                else
                    totalTax += (value[9] - ((value[2].price)  *  value[6]));

            });
            $rootScope.total = {};
            $rootScope.total['subTotal'] = subTotal;
            $rootScope.total['totalAmount'] = totalAmount;
            $rootScope.total['totalTax'] = totalTax;
        });
        this.refreshOrder();
        return true;
    };

    this.checkout = function(cust){
        //console.log($rootScope.searchDetails);
        //this.orderObject.push(cust);
        cust['locality_id'] = $rootScope.searchDetails.selectedLocality.id;
        cust['state_id'] = $rootScope.searchDetails.selectedState;
        cust['city_id'] = $rootScope.searchDetails.selectedCity;
        var orderObject = {};
        orderObject = this.bag;
        orderObject['delivery_address'] = cust.address;
        orderObject['delivery_locality_id'] = $rootScope.searchDetails.selectedLocality.id;
        orderObject['delivery_city_id'] = $rootScope.searchDetails.selectedCity;
        orderObject['delivery_pincode'] = cust.pincode;
        orderObject['delivery_state_id'] = $rootScope.searchDetails.selectedCity;
        orderObject['delivery_landmark'] = cust.landmark;
        orderObject['additional_instructions'] = cust.instruction;
        orderObject['payable_amount'] = $rootScope.total.totalAmount;
        console.log(cust);
        console.log(orderObject);
        return  (api.getCustomerId.save(cust).$promise.then(function(res){
                orderObject['customer_id'] = res;
                return api.order.save(orderObject);
        }));
    };
    this.refreshOrder = function(){
        if($rootScope.order){
            angular.forEach($rootScope.order,function(value,key){
                //console.log(value);
                var additionalPrice = 0;
                var price = value[2].price;
                angular.forEach(value[4],function(value1,key){
                    angular.forEach(value1,function(value2,key){
                       additionalPrice += value2[0].price;
                    });
                });
                value[5] = additionalPrice;
                price += additionalPrice;
                price = price * value[6];
                dataService.getTaxDetails(value[1].id).$promise.then(function(result){
                    angular.forEach(result[0],function(value4,key){
                        if(value4 > 0)
                            price += value4 * price;
                    });
                    value[9] = Math.round(price);
                    var totalAmount = 0;
                    var totalTax = 0;
                    var subTotal = 0;
                    angular.forEach($rootScope.order,function(value9,key){
                        subTotal += ((value9[2].price + value9[5]) * value9[6]);
                        totalAmount += value9[9];
                        totalTax += (value9[9] - ((value9[2].price + value9[5])  *  value9[6]));
                    });
                    $rootScope.total = {};
                    $rootScope.total['subTotal'] = subTotal;
                    $rootScope.total['totalAmount'] = totalAmount;
                    $rootScope.total['totalTax'] = totalTax;
                    });
            });
        }
    };


    this.calculatePrices = function (rest,restaurant,menu){
        //console.log(menu);
        restaurant['name'] = rest.name;
        dataService.getTaxDetails(rest.id).$promise.then(function(res){
            var pricing = dataService.getPackagePricing(rest.id,menu.id);
            angular.forEach(pricing,function(value,key){
                if(menu.order_package_count >= value.min_pax && menu.order_package_count<= value.max_pax){
                    menu.price_per_package = value.price_per_person;
                }
            });
            var additionalPrice = 0;
            angular.forEach(menu.items,function(value,key){
                angular.forEach(value.categories,function(value,key){
                    angular.forEach(value.options,function(value,key){
                       additionalPrice += value.price;
                    });
                });
            });
            restaurant['additional_price'] = additionalPrice;
            restaurant['amount'] = (additionalPrice + menu.price_per_package) * menu.order_package_count;
            restaurant['vat_rate'] = res[0].vat_rate;
            //console.log(res[0].service_charge_rate);
            restaurant['surcharge_rate'] = res[0].service_charge_rate;
            restaurant['service_tax_rate'] = res[0].service_tax_rate;
            restaurant['paid_amount'] = 0;
            restaurant['vat_amount'] = Math.round(restaurant.vat_rate * restaurant.amount);
            restaurant['surcharge_amount'] = Math.round(restaurant.surcharge_rate * restaurant.amount);
            restaurant['service_tax_amount'] = Math.round(restaurant.service_tax_rate * restaurant.amount);
            restaurant['total_amount']= restaurant.vat_amount + restaurant.amount + restaurant.surcharge_amount + restaurant.service_tax_amount;
            restaurant['balance_amount'] = restaurant.amount;
            restaurant.menus.push(menu);
            if(angular.equals({},$rootScope.total)){
                $rootScope.total['subTotal'] = restaurant.amount;
                $rootScope.total['totalAmount'] = restaurant.total_amount;
                $rootScope.total['totalTax'] = restaurant.vat_amount + restaurant.surcharge_amount + restaurant.service_tax_amount;
            }
            else
            {
                $rootScope.total.subTotal += restaurant.amount;
                $rootScope.total.totalAmount += restaurant.total_amount;
                $rootScope.total.totalTax += restaurant.vat_amount + restaurant.surcharge_amount + restaurant.service_tax_amount;
            }

            console.log(restaurant);
            console.log($rootScope.total);

        });
    };

    this.refreshBag = function(){
        if(this.bag.restaurants){
            $rootScope.total.subTotal = 0;
            $rootScope.total.totalAmount = 0;
            $rootScope.total.totalTax = 0;
            angular.forEach(this.bag.restaurants,function(rest,restId){
                rest.additional_price = 0;
                rest.amount = 0;
                angular.forEach(rest.menus,function(menu,key){
                    var pricing = dataService.getPackagePricing(restId,menu.id);
                    angular.forEach(pricing,function(value,key){
                        if(menu.order_package_count >= value.min_pax && menu.order_package_count<= value.max_pax){
                            menu.price_per_package = value.price_per_person;
                        }
                    });
                    var additionalPrice = 0;
                    angular.forEach(menu.items,function(item,itemid){
                        angular.forEach(item.categories,function(category,categoryId){
                            angular.forEach(category.options,function(option,optionId){
                                if(option.price > 0)
                                additionalPrice += option.price;
                            });
                        });
                    });


                    rest.additional_price += additionalPrice;
                    rest.amount += (additionalPrice + menu.price_per_package) * menu.order_package_count;


                });

                rest.vat_amount = Math.round(rest.vat_rate * rest.amount);
                rest.surcharge_amount = Math.round(rest.surcharge_rate * rest.amount);
                rest.service_tax_amount = Math.round(rest.service_tax_rate * rest.amount);
                rest.total_amount= rest.vat_amount + rest.amount + rest.surcharge_amount + rest.service_tax_amount;
                rest.balance_amount = rest.amount;

                $rootScope.total.subTotal += rest.amount;
                $rootScope.total.totalAmount += rest.total_amount;
                $rootScope.total.totalTax += rest.vat_amount + rest.surcharge_amount + rest.service_tax_amount;
                console.log(rest);
                console.log($rootScope.total);
            });
        }
    };

    this.addToBag = function(rest,menu){
        var restaurant = {};
        //console.log(rest);
        //console.log(this.bag.restaurants);
        if(this.bag.restaurants){
            //console.log(this.bag.restaurants[rest.id]);
            if(this.bag.restaurants[rest.id]){
                this.bag.restaurants[rest.id].menus.push(menu);
                //console.log('res found no menu');
                this.refreshBag();
            }
            else {
                restaurant = {};
                restaurant.menus = [];
                this.bag.restaurants[rest.id]  = restaurant;
                //console.log('this res not found');
                this.calculatePrices(rest,restaurant,menu);
            }
        }
        else {
            this.bag['restaurants'] = {};
            restaurant = {};
            restaurant.menus = [];
            this.bag.restaurants[rest.id]  = restaurant;
            //console.log('no res');
            this.calculatePrices(rest,restaurant,menu);



        }
    };


});
