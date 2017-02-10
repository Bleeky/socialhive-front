socialhive = angular.module('socialhive', ['ngRoute', 'ngCookies', 'ngMaterial', 'ngMessages', 'jkuri.gallery', 'md.data.table', 'uiGmapgoogle-maps', 'ngFileUpload', 'ngImgCrop', 'ngMaterialDatePicker', 'chart.js', 'angularTrix']);

var PORT_SERVER = 4284;
var ADDR_SERVER = "http://api.socialhive.fr"
var ADDR_IMAGES = "https://s3.eu-central-1.amazonaws.com/socialhive-prod/upload"
var ADDR_USER_IMG = ADDR_IMAGES + "/users/preview/"
var ADDR_EVENT_IMG = ADDR_IMAGES + "/events/preview/"
var ADDR_COMMUNITY_IMG = ADDR_IMAGES + "/communities/preview/"

socialhive.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'app/partials/login.html',
      controller: 'loginController'
    }).
    when('/event/list', {
      templateUrl: 'app/partials/event/list.html',
      controller: 'eventListController'
    }).
    when('/event/create', {
      templateUrl: 'app/partials/event/create.html',
      controller: 'eventCreateController'
    }).
    when('/event/admin/:id', {
      templateUrl: 'app/partials/event/admin.html',
      controller: 'eventAdminController'
    }).
    when('/event/:id', {
      templateUrl: 'app/partials/event/page.html',
      controller: 'eventPageController'
    }).
    when('/event/:id/participate', {
      templateUrl: 'app/partials/event/participate.html',
      controller: 'eventParticipateController'
    }).
    when('/event/:id/sponsor-participate', {
      templateUrl: 'app/partials/sponsor/participate.html',
      controller: 'sponsorParticipateController'
    }).
    when('/community/list', {
      templateUrl: 'app/partials/community/list.html',
      controller: 'communityListController'
    }).
    when('/community/create', {
      templateUrl: 'app/partials/community/create.html',
      controller: 'communityCreateController'
    }).
    when('/community/admin/:id', {
      templateUrl: 'app/partials/community/admin.html',
      controller: 'communityAdminController'
    }).
    when('/community/:id', {
      templateUrl: 'app/partials/community/page.html',
      controller: 'communityPageController'
    }).
    when('/community/:id/participate', {
      templateUrl: 'app/partials/community/participate.html',
      controller: 'communityParticipateController'
    }).
    when('/user/admin', {
      templateUrl: 'app/partials/user/admin.html',
      controller: 'userAdminController'
    }).
    when('/user/list', {
      templateUrl: 'app/partials/user/list.html',
      controller: 'userListController'
    }).
    when('/user/sponsorings', {
      templateUrl: 'app/partials/sponsor/list.html',
      controller: 'sponsoringsController'
    }).
    when('/user/:id', {
      templateUrl: 'app/partials/user/page.html',
      controller: 'userPageController'
    }).
    when('/message', {
      templateUrl: 'app/partials/user/message.html',
      controller: 'userMessageController'
    }).
    when('/stats', {
      templateUrl: 'app/partials/stats.html',
      controller: 'statsController'
    }).
    when('/reset', {
      templateUrl: 'app/partials/reset.html',
      controller: 'resetController'
    }).
    when('/sponsor/signup', {
      templateUrl: 'app/partials/sponsor/signup.html',
      controller: 'loginController'
    }).
    otherwise({
      redirectTo: '/'
    });
  }
])

/* Wrapper authentification */
.run(['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService', '$window',
  function($rootScope, $location, $cookieStore, $http, AuthenticationService, $window) {
    $rootScope.user = {};

    /*
     * Facebook init
     */
    $window.fbAsyncInit = function() {
      FB.init({
        appId: '1748892542094457',
        channelUrl: './app/partials/channel.html',
        status: true,
        cookie: true,
        xfbml: true
      });
    };

    (function(d) {
      var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      ref.parentNode.insertBefore(js, ref);
    }(document));
    /***/


    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      /* Redirect to login page if not logged in. */
      AuthenticationService.isLog(function() {
        if ($location.path() == '/') {
          $rootScope.isLogged = true;
          $location.path('/event/list');
        }
      }, function() {
        if ($location.path() !== '/' && $location.path() !== '/reset' && $location.path() !== '/sponsor/signup') {
          $rootScope.isLogged = false;
          $location.path('/');
        }
      });
    });
  }
])

.config(['$httpProvider', 'ChartJsProvider', function($httpProvider, ChartJsProvider) {
  /*
   * Configuration needed to be compliant with Golang server's.
   */
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers['Content-Type'] = 'application/json';
  $httpProvider.defaults.withCredentials = true;

  // ChartJS Configuration
  // Configure all charts
  ChartJsProvider.setOptions({
    responsive: true
  });
  // Configure all line charts
  ChartJsProvider.setOptions('Doughnut', {});
}])

/* Angular Material Design CSS initialization */
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('blue')
    .warnPalette('red');
  // .backgroundPalette('white');
})

/* Google Maps API initialization */
.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyDIvY_5Z2eRW_e7njucBSyVMndgoIjQ7ns',
    v: '3.20',
    libraries: 'weather,geometry,visualization'
  });
});
