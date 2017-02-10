socialhive.controller('eventListController', ['$scope', '$location', '$http', 'AuthenticationService', 'EventService', '$mdDialog', '$mdSidenav', '$window', '$document', 'UserService', '$mdToast', function($scope, $location, $http, AuthenticationService, EventService, $mdDialog, $mdSidenav, $window, $document, UserService, $mdToast) {
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

  $scope.filters = {};
  $scope.isLoading = true;

  UserService.getCurrentUser(function(response) {
    $scope.user = response;
    console.log(response);
  });

  $scope.search = function(row) {
    return (angular.lowercase(row.name || "").indexOf(angular.lowercase($scope.query) || '') !== -1 ||
      angular.lowercase(row.description || "").indexOf(angular.lowercase($scope.query) || '') !== -1 ||
      angular.lowercase(row.type || "").indexOf(angular.lowercase($scope.query) || '') !== -1);
  };

  $scope.SHFilters = function(item) {
    if ($scope.filters.organized == true && $scope.user.id != item.creator.id) {
      return false;
    }
    if ($scope.filters.starred == true && item.starred == false) {
      return false;
    }
    if ($scope.filters.participating == true && item.participating == false) {
      return false;
    }
    if (Date.parse(item.start_date) < Date.now()) {
      return false;
    }
    return true;
  }

  $scope.star = function(event) {
    if (event.starred == true) {
      EventService.UnstarEvent(event.id, function(response) {
        $scope.refreshEvents();
      }, function(response) {
        console.log("response")
      });
    } else {
      EventService.StarEvent(event.id, function(response) {
        $scope.refreshEvents();
      }, function(response) {
        console.log("response")
      });
    }
  }

  $scope.refreshEvents = function() {
    EventService.GetEvents(function(list) {
      $scope.list = []; // Reversed list
      for (var k = list.length - 1; k >= 0; k--) {
        list[k].span = {row: 2,col: 1};
        $scope.list.push(list[k]);
      }
      $scope.isLoading = false;
    }, function(response) {
      $scope.isLoading = false;
      $scope.showSimpleToast("Error while gettings events. Please reload.");
    });
  }
  $scope.refreshEvents();
}]);
