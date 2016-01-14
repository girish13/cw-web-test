app.service('alertService',function($rootScope,$timeout){


    $rootScope.alert = {
        show : false,
        alertText : '',
        alertType : 'success'
    };
    //$rootScope.error['show'] = false;
    //this. =  '';
    this.alerts = [];


    this.showAlert = function(index,timeout,alertType){

        $rootScope.alert.alertText = this.alerts[index];
        $rootScope.alert.show = true;

        $timeout(function(){
            $rootScope.alert.show = false;
        },timeout);

    };

   // this.errortext = function(index){
   //    this.error = this.errors[index];
   //};

});