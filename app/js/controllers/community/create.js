'use strict';

socialhive.controller('communityCreateController', ['$scope', '$rootScope', '$location', '$mdToast', '$timeout', 'AuthenticationService', 'EventService', 'UserService',
  function($scope, $rootScope, $location, $mdToast, $timeout, AuthenticationService, EventService, UserService) {
    $scope.ADDR_USER_IMG = ADDR_USER_IMG;
    /*
     * TOAST STUFF
     */
     $scope.showSimpleToast = function(str) {
       $mdToast.show(
         $mdToast.simple()
         .textContent(str)
         .hideDelay(10000)
       );
     };
     /*
      * END OF toast stuff
      */
    $scope.guests = [];

    UserService.getUsers(function(response) {
      $scope.allContacts = response;
      console.log(response);
    }, function(response) {
      console.log(response);
    });

    UserService.getCurrentUser(function(response) {
      $scope.user = response;
    }, function(response) {
      console.log(response);
    });

    var invitePeople = function(id) {
      for (var i = 0; i < $scope.guests.length; i++) {
        UserService.InviteUserCommunity(id, $scope.guests[i].id, function(response) {
        }, function(response) {
          console.log(response);
        });
      }
    }

    $scope.sponsorFilter = function(contact) {
      if (contact.is_sponsor) {
        return false;
      }
      return true;
    }

    $scope.createcommunity = function() {
      if (!$scope.community || !$scope.community.name || $scope.community.name == "") {
        $scope.showSimpleToast("Name is required.");
        return;
      }
      $scope.progress = true;
      UserService.createCommunity($scope.community, function(response) {
        invitePeople(response.id);
        $timeout(function() {
          $location.path('/community/' + response.id);
        }, 3000);
      }, function(response) {
        console.log(response);
        $scope.showSimpleToast("Error while creating community: " + response.cause)
      });
    }
  }
]);
