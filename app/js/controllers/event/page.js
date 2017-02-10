'use strict';

socialhive.controller('eventPageController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'EventService', 'uiGmapGoogleMapApi', '$mdDialog', 'UserService', function($scope, $rootScope, $location, $routeParams, AuthenticationService, EventService, uiGmapGoogleMapApi, $mdDialog, UserService) {
  $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;
  $scope.ADDR_USER_IMG = ADDR_USER_IMG;

  /*
   * CHART LIB STUFF
   */
  $scope.labels = ['Furnished', 'Left'];
  $scope.colors = ['#ff9800', '#d3d3d3'];
  $scope.options = {
    showTooltips: false
  };

  var countNeeds = function(needs) {
    var t = 0;
    var a = 0;

    if (needs != undefined) {
      for (var i = 0; i < needs.length; i++) {
        needs[i].chart = [];
        needs[i].chart[0] = needs[i].acquired;
        needs[i].chart[1] = needs[i].quantity - needs[i].acquired;
        t += needs[i].quantity;
        a += needs[i].acquired;
      }
      needs.chart = [a, t - a];
    }
    return ((a * 100) / t);
  }
  /***/

  /*
   * Google maps stuff
   */
  $scope.map = {
    active: false,
    center: {
      latitude: 43,
      longitude: 3
    },
    zoom: 12
  };
  /***/

  $scope.refreshPostsComs = function() {
    for (var i = 0; i < $scope.e.posts.length; i++) {
      EventService.GetCom($routeParams.id, $scope.e.posts[i].id, i, function(resp) {
resp.boolEditCom = false;
        $scope.e.posts[resp.i]["coms"] = resp;
      }, function(response) {
        console.log(response);
      });
    }
  }

  $scope.refreshPosts = function() {
    EventService.GetPost($routeParams.id, function(response) {
      $scope.e.posts = response;
      $scope.refreshPostsComs();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshEvent = function() {
    EventService.GetEvent($routeParams.id, function(e) {
      console.log(e);
      $scope.e = e;
      $scope.e["tNeeds"] = countNeeds(e.needs);
      $scope.participate = Date.parse(e.start_date) > Date.now();
      $scope.refreshPosts();
      if (e.location.geo_info != undefined) {
        $scope.map = {
          active: true,
          center: {
            latitude: e.location.geo_info.lat,
            longitude: e.location.geo_info.lng
          },
          location: {
            latitude: e.location.geo_info.lat,
            longitude: e.location.geo_info.lng
          },
          zoom: 18,
          id: "0",
          options: {scrollwheel: false},
        };
        uiGmapGoogleMapApi.then(function(maps) {});
      }
    });
  }

  $scope.refreshEvent();

  UserService.getCurrentUser(function(response) {
    $scope.user = response;
  }, function(response) {
    console.log(response);
  });

  $scope.addComment = function(post, msg, i) {
    EventService.PostCom($routeParams.id, post.id, msg, function(response) {
      EventService.GetCom($routeParams.id, post.id, i, function(resp) {
        $scope.e.posts[resp.i]["coms"] = resp;
      }, function(response) {
        console.log(response);
      });
      post.msg = "";
    }, function(response) {
      console.log(response);
    })
  }

  $scope.deleteComment = function(pid, coid) {
    EventService.DeletePostCom($scope.e.id, pid, coid, function(response) {
      $scope.refreshPostsComs();
    }, function(response) {
      console.log(response);
    })
  }

  $scope.editComment = function(coms) {
    coms.boolEditCom = !coms.boolEditCom;
  }

  $scope.saveEditComment = function(post, coms) {
    EventService.EditPostComment($routeParams.id, post.id, coms.id, coms.body, function(response) {
      console.log(response);
      coms.boolEditCom = false;
    }, function(response) {
      console.log(response);
    });
  }
}]);
