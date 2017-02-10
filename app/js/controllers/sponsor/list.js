'use strict';

socialhive.controller('sponsoringsController', ['$scope', '$rootScope', '$location', '$timeout', 'AuthenticationService', 'EventService', 'UserService', '$mdDialog',
    function ($scope, $rootScope, $location, $timeout, AuthenticationService, EventService, UserService, $mdDialog) {
      $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;

      UserService.getCurrentUser(function(response) {
        $scope.me = response;
        $scope.refreshSponsoring();
      }, function(response) {
        console.log(response);
      });

      $scope.refreshSponsoring = function() {
          UserService.getSponsorEvents($scope.me.id, function(response) {
            console.log(response);
            $scope.me.sponsoredEvents = response;
          }, function(response) {
            console.log(response);
          });
          UserService.getSponsoringSent($scope.me.id, function(response) {
            $scope.me.pendingSponsoring = response;
          }, function(response) {
            console.log(response);
          });
      }

      $scope.showSponsoring = function(request) {
        $mdDialog.show({
          controller: function(scope) {
            scope.request = request;
            scope.cancel = function() {
              $mdDialog.hide();
            }
          },
          templateUrl: 'app/partials/event/needs-dialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      };



    }
]);
