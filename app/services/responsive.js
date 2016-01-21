app.service('responsive',function($window,$rootScope){
    //console.log('here');
    var updateWidth = function() {
        $rootScope.width = $window.innerWidth;
        console.log($rootScope.width);
    };
    var updateHeight = function() {
        $rootScope.height = $window.innerHeight;
        console.log($rootScope.height);
    };

    updateWidth();
    updateHeight();

    $window.onresize = function(){
        updateHeight();
        updateWidth();
        $rootScope.$apply();
    };



});