app.controller('locationSearchController',function($rootScope,$scope,$log,api,$state,$filter,alertService,responsive){
    $scope.edit = false;
    //$scope.mytime = null;
    $scope.ismeridian = false;
    //$rootScope.searchDetails.selectedState = '3';
    //$rootScope.searchDetails.selectedCity = '1';
    //
    //$scope.temp = {};

    //if($rootScope.searchDetails){
    //    $scope.selectedLocality = $rootScope.searchDetails.selectedLocality;
    //    $scope.numberOfPersons = $rootScope.searchDetails.pax;
    //    $scope.mytime = $rootScope.searchDetails.time;
    //    $scope.dt = $rootScope.searchDetails.date;
    //}
    //else{
    //    $scope.selectedLocality = '';
    //    $scope.numberOfPersons = '';
    //}

     //api calls

    //$scope.states = api.getStates.query(function(){
    //    //console.log($scope.states);
    //});
    //
    //$scope.cities = api.getCities.query({state_id : $scope.selectedState},function(){
    //
    //});

    //$scope.showDateTimeBlock = function(){
    //    //console.log('here');
    //  return !!(!$rootScope.searchDetails.date || !$rootScope.searchDetails.time || !$rootScope.searchDetails.pax);
    //};
    //
    //$scope.showBlock = function(index){
    //    //console.log('here');
    //    return  !$rootScope.searchDetails[index];
    //};
    //
    //$scope.updateSearchDetails = function(){
    //
    //    $rootScope.searchDetails.date = $scope.temp.date;
    //    $rootScope.searchDetails.time = $scope.temp.time;
    //    $rootScope.searchDetails.pax = $scope.temp.pax;
    //};


    $scope.times = api.getTime.query(function(){
    });


    $scope.localities = api.getLocalities.query({state_id: $rootScope.searchDetails.selectedState,city_id :$rootScope.searchDetails.selectedCity},function(){
    });

    $scope.getStarted =function(){
        if($rootScope.searchDetails.selectedLocality.id){
        //$rootScope.searchDetails.selectedState = $scope.selectedState;
        //$rootScope.searchDetails.selectedCity = $scope.selectedCity;
        //$rootScope.searchDetails.selectedLocality = $scope.selectedLocality;
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
            //$rootScope.searchDetails = {};
            //$rootScope.searchDetails.selectedState = $scope.selectedState;
            //$rootScope.searchDetails.selectedCity = $scope.selectedCity;
            //$rootScope.searchDetails.selectedLocality = $scope.selectedLocality;
            //$rootScope.searchDetails.time =  $scope.mytime;
                //$filter('date')($scope.mytime,'HH:mm');
            //$rootScope.searchDetails.date = $scope.dt;
            //$rootScope.searchDetails.pax = $scope.numberOfPersons;
            //console.log($rootScope.searchDetails);
            //console.log('here');
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


    $scope.changed = function () {
        //$log.log('Time changed to: ' + $scope.mytime);
    };






    $scope.changeEdit = function(){
        //$scope.showSpinners = true;
        //$scope.edit =  true;
    };

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    $scope.maxDate = new Date(yyyy, mm, (dd+90) );
    $scope.minDate = new Date(yyyy, mm, (dd+1));

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.status = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };

});