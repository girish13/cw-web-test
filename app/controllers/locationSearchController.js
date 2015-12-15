app.controller('locationSearchController',function($scope,$log,api,$state,$filter){
    $scope.edit = false;
    $scope.mytime = new Date();
    $scope.ismeridian = false;

    $scope.selectedState = '3';
    $scope.selectedCity = '1';
    $scope.selectedLocality = '';
    $scope.numberOfPersons = '';
     //api calls

    $scope.states = api.getStates.query(function(){
        //console.log($scope.states);
    });

    $scope.cities = api.getCities.query({state_id : $scope.selectedState},function(){

    });

    $scope.localities = api.getLocalities.query({state_id: $scope.selectedState,city_id :$scope.selectedCity},function(){

    });

    $scope.updateLocation = function(){
        if($scope.selectedLocality.id && $scope.dt && $scope.mytime && $scope.numberOfPersons){
       $state.go('search',{locality_id : $scope.selectedLocality.id,date : $filter('date')($scope.dt,'yyyy/MM/dd'),mytime : $filter('date')($scope.mytime,'HH:mm'),pax : $scope.numberOfPersons});
        }
    };


    $scope.changed = function () {
        //$log.log('Time changed to: ' + $scope.mytime);
    };






    $scope.changeEdit = function(){
        //$scope.showSpinners = true;
        //$scope.edit =  true;
    };

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

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