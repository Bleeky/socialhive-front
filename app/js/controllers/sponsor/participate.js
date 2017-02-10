'use strict';

socialhive.controller('sponsorParticipateController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    'EventService', 'uiGmapGoogleMapApi', '$mdDialog', 'UserService', '$timeout',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, EventService, uiGmapGoogleMapApi, $mdDialog, UserService, $timeout) {
      $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;

        UserService.getCurrentUser(function(response){
          $scope.user = response;
        }, function(response) {
          console.log(response);
        });

        EventService.GetEvent($routeParams.id, function (e) {
            $scope.e = e;
            $scope.e.sponsor_stuff = [];
        }, function(response) {
          console.log(response);
        });

        $scope.send = function() {
          $scope.progress = true;
          var ask = {"message" : $scope.message, "contribution" : $scope.e.sponsor_stuff};
          EventService.sponsorParticipate($routeParams.id, ask, function(response) {
            $timeout(function() {
              $location.path('/event/' + $routeParams.id);
            }, 500);
          }, function(response) {
            $scope.progress = false;
            console.log(response);
          });
        }

        $scope.addNeed = function() {
          $scope.e.sponsor_stuff.push({
            name: "",
            quantity: 1,
            optional: false,
            description: "",
            type: "",
          });
        }

        $scope.removeNeed = function(index) {
          $scope.e.sponsor_stuff.splice(index, 1);
        }

    }
]);
