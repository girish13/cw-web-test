app.controller('locationSearchController',function($rootScope,$scope,$state,alertService,dataService){


    $scope.datePickerStatus = {
        opened: false
    };




    $scope.getTimeList = function(){
        if(!$scope.times){
            dataService.getTimeList().$promise.then(function(res){
                $scope.times = res;
            });
        }
    };

    $scope.getLocalities = function(){
        if(!$scope.localities){
            dataService.getLocalities().$promise.then(function(res){
                //console.log(res);
                $scope.localities = res;
            });
        }
    };

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



    $scope.getStarted =function(){
        if($rootScope.searchDetails.selectedLocality.id){
            $state.go('search');
        }
        else if($rootScope.searchDetails.selectedLocality == '') {
            alertService.showAlert('noLocationError',3000,'error');
        }
        else
        {
            alertService.showAlert('locationInvalid',3000,'error')
        }
    };

    $scope.updateLocation = function(){
        if($rootScope.searchDetails.selectedLocality.id){
            $state.go('search');
        }
        else if($rootScope.searchDetails.selectedLocality == '') {
            alertService.showAlert('noLocationError',3000,'error');
        }
        else
        {
            alertService.showAlert('locationInvalid',3000,'error')
        }
    };

    $scope.getTimeList();
    $scope.getLocalities();
    $scope.setDate();

});


app.controller('dateTimeModalController',function($uibModalInstance,$scope,$rootScope,dataService){


    $scope.datePickerStatus = {
        opened: false
    };




    $scope.getTimeList = function(){
        if(!$scope.times){
            dataService.getTimeList().$promise.then(function(res){
                $scope.times = res;
            });
        }
    };

    $scope.getLocalities = function(){
        if(!$scope.localities){
            dataService.getLocalities().$promise.then(function(res){
                //console.log(res);
                $scope.localities = res;
            });
        }
    };

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



    $scope.getStarted =function(){
        if($rootScope.searchDetails.selectedLocality.id){
            $state.go('search');
        }
        else if($rootScope.searchDetails.selectedLocality == '') {
            alertService.showAlert('noLocationError',3000,'error');
        }
        else
        {
            alertService.showAlert('locationInvalid',3000,'error')
        }
    };

    $scope.updateLocation = function(){
        if($rootScope.searchDetails.selectedLocality.id){
            $state.go('search');
        }
        else if($rootScope.searchDetails.selectedLocality == '') {
            alertService.showAlert('noLocationError',3000,'error');
        }
        else
        {
            alertService.showAlert('locationInvalid',3000,'error')
        }
    };

    $scope.modalClose = function(){
        if($rootScope.searchDetails.date && $rootScope.searchDetails.time){
            $uibModalInstance.close();
        }
        //else if(){
        //
        //}
        //else {
        //
        //}
    };

    $scope.getTimeList();
    $scope.getLocalities();
    $scope.setDate();


});