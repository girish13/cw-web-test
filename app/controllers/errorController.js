app.controller('errorController',function($scope,errorService,$timeout){

    $scope.showErr = false;
    $scope.error = '';

    $scope.showError = function(index,timeout){
        errorService.errortext(index);
        $scope.error = errorService.error;

        $scope.showErr = true;

        $timeout(function(){
            $scope.showErr = false;
        },timeout);


    }

});