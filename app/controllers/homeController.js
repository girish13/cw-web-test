app.controller('homeController', function ($state,$scope,$uibModal,dataService,alertService,$rootScope) {
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


    $scope.getLocalities = function(){
        if(!$scope.localities){
           dataService.getLocalities().$promise.then(function(res){
               //console.log(res);
                $scope.localities = res;
            });
        }
    };

    //console.log('here');
    $scope.getLocalities();

});