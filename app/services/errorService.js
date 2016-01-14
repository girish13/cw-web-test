app.service('alertService',function($rootScope,$timeout){


    $rootScope.alert = {
        show : false,
        alertText : '',
        alertType : ''
    };
    //$rootScope.error['show'] = false;
    //this. =  '';
    this.alerts = {
        noLocationError : 'Please enter a location',
        locationInvalid : 'Please enter a valid location',
        moreThanMax : 'You Cannot Select more',
        lessPackageError : 'You cannot select less than 10 packages from this restaurant'
        };


    this.showAlert = function(index,timeout,alertType){

        $rootScope.alert.alertText = this.alerts[index];
        $rootScope.alert.show = true;
        $rootScope.alert.alertType = alertType;
        $timeout(function(){
            $rootScope.alert.show = false;
        },timeout);

    };

   // this.errortext = function(index){
   //    this.error = this.errors[index];
   //};

});