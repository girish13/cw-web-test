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
            templateUrl : 'templates/restaurantSearch.tpl.html',
            controller : 'restaurantSearchController'
        })
        .state('restaurant', {
            //parent : 'common',
            url: '/restaurant/:id',
            templateUrl : "templates/restaurantDetail.tpl.html",
            //views : {
            //    "header" : {templateUrl : "templates/header.tpl.html"},
            //    "content" :{templateUrl : "templates/restaurantDetail.tpl.html" }
            //},
            controller: 'restaurantController as restaurant'
        })
        .state('restaurant.packages',{
            url : '/packages',
            templateUrl : "templates/restaurantDetailMenu/restaurantPackages.tpl.html",
            controller : 'restaurantPackagesController'
        })
        .state('restaurant.alacarte',{
            url : '/alacarte',
            templateUrl : "templates/restaurantDetailMenu/restaurantAlacarte.tpl.html",
            controller : 'restaurantAlacarteController'
        })
        .state('restaurant.reviews',{
            url : '/reviews',
            templateUrl : "templates/restaurantDetailMenu/restaurantReviews.tpl.html",
            controller : 'restaurantReviewsController'
        })
        .state('restaurant.pictures',{
            url : '/pictures',
            templateUrl : "templates/restaurantDetailMenu/restaurantPictures.tpl.html",
            controller : 'restaurantPicturesController'
        })
        .state('restaurant.about',{
            url : '/about',
            templateUrl : "templates/restaurantDetailMenu/restaurantAbout.tpl.html"
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
            controller : "SignUpController"
        })
        .state('corporateSignUp',{
            url : '/Corporate',
            templateUrl : "templates/corporateSignUp.tpl.html",
            controller : "SignUpController"
        })
        .state('orderConfirmed',{
            url : '/orderConfirmed',
            templateUrl : 'templates/orderConfirmed.tpl.html',
            controller : 'orderController'
        });



    //$locationProvider.html5Mode(true);
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $urlRouterProvider.otherwise('/');

})
    .controller('authController',function($rootScope){
       $rootScope.custId = 0;
    });
app.run(function($rootScope,$state,$window){
    $rootScope.$state = $state;
    $rootScope.imagePath = '';

    var updateWidth = function() {
        $rootScope.width = $window.innerWidth;
        //console.log($rootScope.width);
    };
    var updateHeight = function() {
        $rootScope.height = $window.innerHeight;
        //console.log($rootScope.height);
    };

    updateWidth();
    updateHeight();

    $window.onresize = function(){
        updateHeight();
        updateWidth();
        $rootScope.$apply();
    };
});
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
app.controller('SignUpController',function($scope){
});
