app.controller('locationSearchController',function($rootScope,$scope,$state,alertService,dataService,locationService){


    $scope.datePickerStatus = {
        opened: false
    };

    $scope.localities = locationService.localities;
    $scope.times = locationService.times;

    $scope.setDate = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        $scope.maxDate = new Date(yyyy, mm, (dd+90) );
        $scope.minDate = new Date(yyyy, mm, (dd+1));

    };

    $scope.openDatePicker = function($event) {
        $scope.datePickerStatus.opened = true;
    };

    $scope.updateLocation = function(){
        if($rootScope.searchDetails.selectedLocality.id){
            $state.go('search',{stateName : 'gurgaon' , localityName : $rootScope.searchDetails.selectedLocality.name});
        }
        else if($rootScope.searchDetails.selectedLocality == '') {
            alertService.showAlert('noLocationError',3000,'error');
        }
        else
        {
            alertService.showAlert('locationInvalid',3000,'error')
        }
    };

    $scope.setDate();

});


app.controller('dateTimeModalController',function($uibModalInstance,$scope,$rootScope,dataService,locationService){


    $scope.datePickerStatus = {
        opened: false
    };

    $scope.localities = locationService.localities;
    $scope.times = locationService.times;

    $scope.setDate = function(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        $scope.maxDate = new Date(yyyy, mm, (dd+90) );
        $scope.minDate = new Date(yyyy, mm, (dd+1));

    };

    $scope.openDatePicker = function($event) {
        $scope.datePickerStatus.opened = true;
    };
    //
    //
    //$scope.updateLocation = function(){
    //    if($rootScope.searchDetails.selectedLocality.id){
    //        $state.go('search');
    //    }
    //    else if($rootScope.searchDetails.selectedLocality == '') {
    //        alertService.showAlert('noLocationError',3000,'error');
    //    }
    //    else
    //    {
    //        alertService.showAlert('locationInvalid',3000,'error')
    //    }
    //};

    $scope.modalClose = function(){
        if($rootScope.searchDetails.date && $rootScope.searchDetails.time){
            $uibModalInstance.close();
        }
    };

    $scope.setDate();


});