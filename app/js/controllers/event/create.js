socialhive.controller('eventCreateController', ['$scope', '$rootScope', '$location', '$mdToast', '$timeout', 'AuthenticationService', 'EventService', 'UserService', function($scope, $rootScope, $location, $mdToast, $timeout, AuthenticationService, EventService, UserService) {
  $scope.ADDR_USER_IMG = ADDR_USER_IMG;
  $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;
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

  $scope.event = {};
  $scope.now = new Date();
  $scope.event.location = {};
  $scope.event.needs = [];
  $scope.event.private = false;
  $scope.event.type = "Other"
  $scope.types = ["Party", "Sport", "Concert", "Going out", "Meeting", "Work", "Other"];
  $scope.guests = [];

  UserService.getCurrentUser(function(response) {
    $scope.user = response;
    $scope.refreshCommunities();
  }, function(response) {
    console.log(response);
  });

  UserService.getUsers(function(response) {
    $scope.allContacts = response;
  }, function(response) {
    console.log(response);
  });

  $scope.refreshCommunities = function() {
    UserService.getComunitiesSpec('?own=true', function(response) {
      $scope.user.communitiesOwned = response;
    }, function(response) {
      console.log(response);
    });
  }

  var invitePeople = function(id) {
    for (var i = 0; i < $scope.guests.length; i++) {
      EventService.InvitePeople(id, $scope.guests[i].id, function(response) {
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

  var badEntries = function() {
    if ($scope.event.name == "" || $scope.event.name == undefined) {
      $scope.showSimpleToast("Name of the event is required.");
      return true;
    } else if ($scope.event.location.address == "" || $scope.event.location.address == undefined ||
      $scope.event.location.city == "" || $scope.event.location.city == undefined ||
      $scope.event.location.country == "" || $scope.event.location.country == undefined ||
      $scope.event.location.zip == "" || $scope.event.location.zip == undefined) {
      $scope.showSimpleToast("Adress of the event is required.")
      return true;
    } else if (!$scope.event.date || !$scope.event.end) {
      $scope.showSimpleToast("You must select a date.")
      return true;
    }
    return false;
  }

  $scope.create = function() {
    if (badEntries()) {
      return;
    }
    $scope.progress = true;
    EventService.AddEvent($scope.event, function(response) {
      invitePeople(response.id);
      $timeout(function() {
        $location.path('/event/' + response.id);
      }, 2000);
    }, function(response) {
      console.log(response);
      $scope.showSimpleToast("Error during creation : " + response.cause + ".");
      $scope.progress = false;
    });
  };

  $scope.addPeople = function(p) {
    $scope.guests.push(p);
  }

  $scope.removeFromGuests = function(index) {
    $scope.guests[index].sent = false;
    $scope.guests.splice(index, 1);
  }

  $scope.addNeed = function() {
    $scope.event.needs.push({
      name: "",
      quantity: 1,
      optional: false,
      description: "",
      type: "",
    });
  }

  $scope.removeNeed = function(index) {
    $scope.event.needs.splice(index, 1);
  }
}])
