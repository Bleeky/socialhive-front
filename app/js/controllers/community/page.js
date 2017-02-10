'use strict';

socialhive.controller('communityPageController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService', 'EventService', 'UserService',
  function($scope, $rootScope, $location, $routeParams, AuthenticationService, EventService, UserService) {
    $scope.ADDR_USER_IMG = ADDR_USER_IMG;
    $scope.ADDR_COMMUNITY_IMG = ADDR_COMMUNITY_IMG;
    $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;

    //! Know if the user is inside the community.
    var isInside = function() {
      $scope.inside = false;
      if ($scope.user.id == $scope.community.admin.id) {
        $scope.inside = true;
      }
      if ($scope.community.members) {
        for (var i = 0; i < $scope.community.members.length; i++) {
          if ($scope.community.members[i].id == $scope.user.id) {
            $scope.inside = true;
          }
        }
      }
    }

    $scope.refreshUser = function() {
      UserService.getCurrentUser(function(response) {
        $scope.user = response;
        isInside();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refreshPosts = function() {
      UserService.getComunityPosts($routeParams.id, function(response) {
        $scope.community.posts = response;
        $scope.refreshPostsComs();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refreshPostsComs = function() {
      for (var i = 0; i < $scope.community.posts.length; i++) {
        $scope.tmp_i = i;
        UserService.getCommunityPostComments($routeParams.id, $scope.community.posts[i].id, function(resp) {
          resp.boolEditCom = false;
          $scope.community.posts[$scope.tmp_i]["comments"] = resp;
        }, function(response) {
          console.log(response);
        });
      }
    }

    $scope.refreshEvents = function() {
      UserService.getCommunityEvents($routeParams.id, function(response) {
        $scope.community.events = response;
      }, function(response) {
        console.log(response);
      });
    }

    UserService.getComunity($routeParams.id, function(response) {
      $scope.community = response;
      console.log(response);
      $scope.refreshUser();
      $scope.refreshPosts();
      $scope.refreshEvents();
    }, function(response) {
      console.log(response);
    });

    $scope.addComment = function(post, msg, i) {
      UserService.CreateCommunityPostComment($routeParams.id, post.id, {
        "body": msg
      }, function(response) {
        $scope.refreshPostsComs();
        post.msg = "";
      }, function(response) {
        console.log(response);
      })
    }

      $scope.deleteComment = function(pid, coid) {
        UserService.DeleteCommentFromCommunity($scope.community.id, pid, coid, function(response) {
          $scope.refreshPostsComs();
        }, function(response) {
          console.log(response);
        })
      }

      $scope.editComment = function(coms) {
        coms.boolEditCom = !coms.boolEditCom;
      }

      $scope.saveEditComment = function(post, coms) {
        UserService.updateCommunityPostComment($routeParams.id, post.id, coms.id, {"body" : coms.body}, function(response) {
          coms.boolEditCom = false;
        }, function(response) {
          console.log(response);
        });
      }
  }
]);
