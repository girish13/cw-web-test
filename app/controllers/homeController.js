app.controller('homeController', function ($state, $auth,$scope) {
    var vm = this;
    vm.errors = {
        register_name : '',
        register_email : '',
        register_number : '',
        register_password : '',
        login_email : '',
        login_password : '',
        login_fail : ''
    };

    vm.reset = function() {
        vm.errors = {
            register_name : '',
            register_email : '',
            register_number : '',
            register_password : '',
            login_email : '',
            login_password : '',
            login_fail : ''
        };
    };

    vm.user = {};



    //vm.userName = $rootScope.userName;
    //vm.authenticate = function(provider) {
    //  $auth.authenticate(provider);
    //};
    //

    vm.isAuthenticated = function __isAuthenticated(){
        return $auth.isAuthenticated();
    };

    vm.login = function __login() {
        $auth.login({
            email: vm.login.user.email,
            password: vm.login.user.password
        }).then(function (response) {
            //console.log(response);
            vm.reset();
            $state.go('home');
            jQuery('#login').modal('toggle');
            vm.login.user.email = '';
            vm.login.user.password = '';
        }).catch(function (response) {
            //console.log(response);
            vm.reset();
            var result = angular.fromJson(response.data);
            if(result[0] != undefined)
                vm.errors.login_fail = "Invalid Email or Password";
            if(result.email)
                vm.errors.login_email = result.email[0];
            if(result.password)
                vm.errors.login_password = result.password[0];
            console.log('Error: Login failed');
            vm.login.user.password = '';
        });
    };
    vm.register = function __register() {
        $auth.signup({
            name: vm.register.user.name,
            number: vm.register.user.number,
            email: vm.register.user.email,
            password: vm.register.user.password
        }).then(function (response) {
            //console.log(response);
            vm.reset();
            $state.go('home');
            jQuery('#login').modal('toggle');
            vm.register.user.name = '';
            vm.register.user.email = '';
            vm.register.user.number = '';
            vm.register.user.password = '';
        }).catch(function (response) {
            vm.reset();
            var result = angular.fromJson(response.data);
            if(result.name)
                vm.errors.register_name = result.name[0];
            if(result.email)
                vm.errors.register_email = result.email[0];
            if(result.number)
                vm.errors.register_number = result.number[0];
            //console.log(vm.errors.register_number);
            if(result.password)
                vm.errors.register_password = result.password[0];
            vm.register.user.password = '';
            console.log('Error: Register failed');
        });
    };
    vm.logout = function __logout() {
        $auth.logout();
        $state.go('home');
    };

    /* Homepage*/





});