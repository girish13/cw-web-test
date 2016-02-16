app.service('locationService',function(dataService,$rootScope){

    $rootScope.searchDetails = {
        selectedState : 1,
        selectedCity : 1,
        selectedLocality : null,
        pax : '',
        date : '',
        time : ''
    };

    this.searchDetails = {
        selectedState : 1,
        selectedCity : 1,
        selectedLocality : null,
        pax : '',
        date : '',
        time : ''
    };

    this.setLocality = function(id){
      return ( dataService.getLocalities().$promise.then(function(res){
            var temp = null;
            angular.forEach(res,function(value,key){
                if(value.id == id){
                    temp = value;
                    $rootScope.searchDetails.selectedLocality = value;
                    return true;
                }
            });
            return temp;
        }) );
    };

    this.getTimeList = function(){
        if(!this.times){
            this.times = dataService.getTimeList();
        }
    };

    this.getLocalities = function(){
        if(!this.localities){
            this.localities = dataService.getLocalities();
        }
    };

    this.getTimeList();
    this.getLocalities();

});