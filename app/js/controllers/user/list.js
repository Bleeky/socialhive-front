'use strict';

socialhive.controller('userListController', ['$scope', '$rootScope', '$location', '$timeout', 'AuthenticationService', 'EventService', 'UserService', 'MessageService',
    function ($scope, $rootScope, $location, $timeout, AuthenticationService, EventService, UserService, MessageService) {
      $scope.ADDR_USER_IMG = ADDR_USER_IMG;
      $scope.progress = true;

      UserService.getUsers(function(response){
        $scope.allContacts = response;
        $scope.progress = false;
        console.log(response);
      }, function(response) {
        $scope.progress = false;
        console.log(response);
      });

      UserService.getCurrentUser(function(response) {
        $scope.user = response;
        console.log(response);
      });

      $scope.friendsFilter = function(contact) {
        if (contact.is_sponsor == true) {
          return false;
        }
        if ($scope.user && $scope.user.friendsFilter == true) {
          if ($scope.user.friends == undefined) {
            return false;
          }
          for (var i = 0; i < $scope.user.friends.length; i++) {
            if (contact.id == $scope.user.friends[i].id) {
              return true;
            }
          }
          return false;
        }
        return true;
      }

      $scope.sponsorFilter = function(contact) {
        return contact.is_sponsor;
      }

      $scope.createConv = function(target) {
        MessageService.createConv(target.id, "", function(response) {
          $timeout(function () {
            $location.path('/message');
          }, 100);
        });
      }

    }
]);
