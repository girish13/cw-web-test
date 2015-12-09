var app = angular.module('app', ['checklist-model','ui.router','ui.filters','satellizer','ui.bootstrap','ngResource','ngTagsInput','ngAnimate'])
.run(function($rootScope) {
    $rootScope.$on('$stateChangeError', console.log.bind(console));
})
.value('baseUrl','http://52.34.246.229/cw-api-test/public/api/v001/')
.config( function ($stateProvider, $urlRouterProvider, $authProvider,$locationProvider, $resourceProvider) {
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
            controller : 'hotelSearchController'
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
        });
        //.state('dashboard', {
        //    url: '/dashboard',
        //    templateUrl: 'templates/dashboard.tpl.html',
        //    controller: 'DashboardCtrl as dashboard'
        //})


    //$locationProvider.html5Mode(true);
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $urlRouterProvider.otherwise('/hotel/packages');

    // $authProvider.facebook({
    //  clientId: '657854390977827'
    //});
    //
    //$authProvider.google({
    //  clientId: 'Google Client ID'
    //});

    //$rootScope.baseUrl = 'http://192.168.0.105/cw-api-test/public/api/v001/';
    $authProvider.loginUrl = 'http://192.168.0.120/random/public/api/v1/auth/login';
    $authProvider.signupUrl = 'http://192.168.0.120/random/public/api/v1/auth/register';
});
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
