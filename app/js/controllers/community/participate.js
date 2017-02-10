'use strict';

socialhive.controller('communityParticipateController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
  'EventService', 'uiGmapGoogleMapApi', '$mdDialog', 'UserService',
  function($scope, $rootScope, $location, $routeParams, AuthenticationService, EventService, uiGmapGoogleMapApi, $mdDialog, UserService) {
    $scope.ADDR_COMMUNITY_IMG = ADDR_COMMUNITY_IMG;

    UserService.getComunity($routeParams.id, function(response) {
      $scope.community = response;
    }, function(response) {
      console.log(response)
    })

    $scope.send = function() {
      UserService.CreateDemandMembership($routeParams.id, function(response) {
        $location.path("/community/" + $routeParams.id);
      }, function(response) {
        console.log(response);
      });
    }
  }
]);
