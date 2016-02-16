app.controller('homeController', function ($state,$scope,$uibModal,dataService,alertService,$rootScope,locationService) {

    $scope.localities = locationService.localities;
    $scope.mobileSite = false;

    $scope.openContactUs = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'contactUsModal.html',
            size : 'sm',
            controller : function($scope,$uibModalInstance){
                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        });
    };


    $scope.getStarted =function(){
        if($rootScope.searchDetails.selectedLocality.id){
            var locationString = $rootScope.searchDetails.selectedLocality.name + ' gurgaon';
            locationString = locationString.replace(/\s+/g, '-').toLowerCase();
            $state.go('search',{localityString : locationString,localityId : $rootScope.searchDetails.selectedLocality.id});
        }
        else if($rootScope.searchDetails.selectedLocality == '') {
            alertService.showAlert('noLocationError',3000,'error');
        }
        else
        {
            alertService.showAlert('locationInvalid',3000,'error')
        }
    };

});