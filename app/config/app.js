var app = angular.module('app', ['checklist-model','ui.router','ui.filters','ui.bootstrap','ngResource','ngAnimate','rzModule'])
.run(function($rootScope) {
    $rootScope.$on('$stateChangeError', console.log.bind(console));
})
.value('baseUrl','http://52.34.246.229/cw-api-test/public/api/v001/')
.config( function ($stateProvider, $urlRouterProvider,$locationProvider, $resourceProvider) {
    $stateProvider
        .state('common',{
            templateUrl: 'templates/header.tpl.html'
            //abstract : true
        })
        .state('home', {
            url: '/',
            templateUrl: 'templates/home.tpl.html',
            controller: 'homeController as home'
        })
        .state('search',{
            url:'/search',
            templateUrl : 'templates/hotelSearch.tpl.html',
            controller : 'hotelSearchController',
            params : {
                locality_id : null,
                date : null,
                mytime : null,
                pax : null
            }
        })
        .state('hotel', {
            //parent : 'common',
            url: '/hotel/:id',
            templateUrl : "templates/hotelDetail.tpl.html",
            //views : {
            //    "header" : {templateUrl : "templates/header.tpl.html"},
            //    "content" :{templateUrl : "templates/hotelDetail.tpl.html" }
            //},
            controller: 'hotelController as hotel'
        })
        .state('hotel.packages',{
            url : '/packages',
            templateUrl : "templates/hotelDetailMenu/hotelPackages.tpl.html",
            controller : 'hotelPackagesController'
        })
        .state('hotel.alacarte',{
            url : '/alacarte',
            templateUrl : "templates/hotelDetailMenu/hotelAlacarte.tpl.html",
            controller : 'hotelAlacarteController'
        })
        .state('hotel.reviews',{
            url : '/reviews',
            templateUrl : "templates/hotelDetailMenu/hotelReviews.tpl.html",
            controller : 'hotelReviewsController'
        })
        .state('hotel.pictures',{
            url : '/pictures',
            templateUrl : "templates/hotelDetailMenu/hotelPictures.tpl.html",
            controller : 'hotelPicturesController'
        })
        .state('hotel.about',{
            url : '/about',
            templateUrl : "templates/hotelDetailMenu/hotelAbout.tpl.html"
        })
        .state('checkout',{
            url : '/checkout',
            templateUrl : "templates/checkout.tpl.html",
            controller : 'orderController'
        })
        .state('editOrder',{
            url : '/editorder',
            templateUrl : "templates/editOrder.tpl.html",
            controller : 'orderController'
        })
        .state('faq',{
            url : '/faqs',
            templateUrl : "templates/staticTemplates/faq.tpl.html"
        })
        .state('terms',{
            url : '/TermsAndConditions',
            templateUrl : "templates/staticTemplates/termsAndConditions.tpl.html"
        })
        .state('policy',{
            url : '/PrivacyPolicies',
            templateUrl : "templates/staticTemplates/privacyPolicy.tpl.html"
        })
        .state('partnerSignUp',{
            url : '/PartnerWithUs',
            templateUrl : "templates/partnerSignUp.tpl.html",
            controller : "partnerSignUpController"
        });
        //.state('dashboard', {
        //    url: '/dashboard',
        //    templateUrl: 'templates/dashboard.tpl.html',
        //    controller: 'DashboardCtrl as dashboard'
        //})


    //$locationProvider.html5Mode(true);
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $urlRouterProvider.otherwise('/');

    // $authProvider.facebook({
    //  clientId: '657854390977827'
    //});
    //
    //$authProvider.google({
    //  clientId: 'Google Client ID'
    //});
    //
    //$rootScope.baseUrl = 'http://192.168.0.105/cw-api-test/public/api/v001/';
    //$authProvider.loginUrl = 'http://192.168.0.120/random/public/api/v1/auth/login';
    //$authProvider.signupUrl = 'http://192.168.0.120/random/public/api/v1/auth/register';
})
    .controller('authController',function($rootScope){
       $rootScope.custId = 0;
        //console.log($rootScope.custId);
    });
app.run(function($rootScope,$state){
    $rootScope.$state = $state;
});
//
//angular.module('app')
//    .directive('datepickerPopup', function (){
//        return {
//            restrict: 'EAC',
//            require: 'ngModel',
//            link: function(scope, element, attr, controller) {
//                //remove the default formatter from the input directive to prevent conflict
//                controller.$formatters.shift();
//            }
//        }
//    });
app.directive('wrapOwlcarousel', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var options = scope.$eval($(element).attr('data-options'));
            $(element).owlCarousel(options);
        }
    };
});
app.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<=max; i++)
            input.push(i);
        return input;
    };
});
app.controller('partnerSignUpController',function($scope){

});
//angular.module('app', ['rzModule']);

//
//.controller('RegisterCtrl', function ($state, $auth) {
//    var vm = this;
//
//    vm.user = {};
//
//
//})
//.controller('DashboardCtrl', function ($state, $auth) {
//    var vm = this;
//
//
//})
