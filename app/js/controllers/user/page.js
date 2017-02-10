'use strict';

socialhive.controller('userPageController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'EventService', 'UserService', '$mdDialog', '$mdSidenav', '$routeParams', 'MessageService', '$timeout', function($scope, $rootScope, $location, AuthenticationService, EventService, UserService, $mdDialog, $mdSidenav, $routeParams, MessageService, $timeout) {
  $scope.ADDR_USER_IMG = ADDR_USER_IMG;
  $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;
  $scope.ADDR_COMMUNITY_IMG = ADDR_COMMUNITY_IMG;

  /*
   * Chart tab libs stuff.
   */
  $scope.labels = ["Badges obtained", "Badges lefts"];
  $scope.colors = ["#ff9800", "#d3d3d3"];
  /***/

  UserService.getCurrentUser(function(response) {
    $scope.me = response;
    $scope.refreshUser();
    UserService.getUsersSpec("?friends=true", function(response) {
      $scope.me.friends = response;
    }, function(response) {
      console.log(response);
    });
  });

  $scope.refreshUser = function() {
    UserService.getUser($routeParams.id, function(response) {
      $scope.user = response;
      console.log(response);
      $scope.refreshAllFromUser();
    }, function(response) {
      if (response.private == true && $routeParams.id != $scope.me.id) {
        $scope.user = response;
      } else {
        $scope.user = $scope.me;
        $scope.refreshAllFromUser();
      }
      console.log(response);
    });
  };

  $scope.refreshAllFromUser = function() {
    $scope.refreshPosts();
    if ($scope.user.is_sponsor != true) {
      $scope.refreshFriends();
      $scope.refreshActivities();
      $scope.refreshBadges();
      if ($scope.user.id == $scope.me.id) {
        $scope.refreshEventInvitations();
        $scope.refreshCommunityInvitations();
        $scope.refreshUserInvitations();
      }
    } else {
      $scope.refreshSponsoring();
    }
  }

  $scope.refreshSponsoring = function() {
    UserService.getSponsorEvents($scope.user.id, function(response) {
      $scope.user.sponsoredEvents = response;
    }, function(response) {
      console.log(response);
    });
    UserService.getSponsoringSent($scope.me.id, function(response) {
      $scope.user.pendingSponsoring = response;
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshPostsComs = function() {
    for (var i = 0; i < $scope.user.posts.length; i++) {
      UserService.getUserPostComments($scope.me.id, $scope.user.posts[i].id, i, function(resp) {
        resp.boolEditCom = false;
        $scope.user.posts[resp.i]["coms"] = resp;
      }, function(response) {
        console.log(response);
      });
    }
  }

  $scope.refreshPosts = function() {
    UserService.getUserPosts($scope.user.id, function(response) {
      $scope.user.posts = response;
      $scope.refreshPostsComs();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshEventInvitations = function() {
    UserService.invitationEventReceived(function(response) {
      $scope.eventInvitations = response;
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshCommunityInvitations = function() {
    UserService.invitationCommunityReceived(function(response) {
      $scope.communitiesInvitations = response;
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshUserInvitations = function() {
    UserService.friendRequest(function(response) {
      $scope.friendRequest = response;
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshFriends = function() {
    UserService.getUserFriends($routeParams.id, function(response) {
      $scope.user.friends = response;
    }, function(response) {
      console.log(response);
    });
  }

  var sortEvents = function(list) {
    var now = Date.now();
    $scope.user.eventAttended = [];
    $scope.user.eventAttending = [];
    for (var i = 0; i < list.length; i++) {
      if (Date.parse(list[i].start_date) > now) {
        $scope.user.eventAttending.push(list[i]);
      } else {
        $scope.user.eventAttended.push(list[i]);
      }
    }
  }

  $scope.refreshActivities = function() {
    UserService.getUserActivities($routeParams.id, function(response) {
      $scope.user.communitiesOwned = response.community_created;
      $scope.user.communities = response.community_member;
      $scope.user.eventOrganized = response.events_created;
      $scope.user.eventStarred = response.events_starred;
      sortEvents(response.events_participated);
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshBadges = function() {
    /*
     * Mock up stuff, to be deleted after integration.
     */
    console.log("badge");
    console.log($scope.user.badges);
    $scope.user.badges = [{
      href: "./app/static/img/social.png",
      gained: $scope.user.badges.social
    }, {
      href: "./app/static/img/very_social.png",
      gained: $scope.user.badges.very_social
    }, {
      href: "./app/static/img/1_friends.png",
      gained: $scope.user.badges.one_friends
    }, {
      href: "./app/static/img/5_friends.png",
      gained: $scope.user.badges.five_friends
    }, {
      href: "./app/static/img/10_friends.png",
      gained: $scope.user.badges.ten_friends
    }, {
      href: "./app/static/img/1_organizations.png",
      gained: $scope.user.badges.one_organized
    }, {
      href: "./app/static/img/5_organizations.png",
      gained: $scope.user.badges.five_organized
    }, {
      href: "./app/static/img/10_organizations.png",
      gained: $scope.user.badges.ten_organized
    }, {
      href: "./app/static/img/1_participations.png",
      gained: $scope.user.badges.one_participation
    }, {
      href: "./app/static/img/5_participations.png",
      gained: $scope.user.badges.five_participation
    }, {
      href: "./app/static/img/10_participations.png",
      gained: $scope.user.badges.ten_participation
    }, ];

    $scope.user.badgesGained = $scope.user.badges.filter(function(elem) {
      return elem.gained == true;
    }).length;
    $scope.data = [$scope.user.badgesGained, parseInt(10, $scope.user.badges.length - $scope.user.badgesGained)];
    /*
     * END OF Mock up stuff
     */
  }

  $scope.addComment = function(post, msg, i) {
    UserService.CreateUserPostComment($scope.user.id, post.id, {
      "body": msg
    }, function(response) {
      $scope.refreshPostsComs();
      post.msg = "";
    }, function(response) {
      console.log(response);
    })
  }

  $scope.deleteComment = function(pid, coid) {
    UserService.deleteUserPostComment($scope.user.id, pid, coid, function(response) {
      $scope.refreshPostsComs();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.editComment = function(coms) {
    coms.boolEditCom = !coms.boolEditCom;
  }

  $scope.saveEditComment = function(post, coms) {
    UserService.updateUserPostComment($routeParams.id, post.id, coms.id, {
      "body": coms.body
    }, function(response) {
      coms.boolEditCom = false;
    }, function(response) {
      console.log(response);
    });
  }

  $scope.addFriend = function() {
    $scope.progress = true;
    UserService.AddFriend($scope.user.id, function(response) {
      $scope.refreshUser();
      $scope.progress = false;
    }, function(response) {
      $scope.progress = false;
      console.log(response);
    });
  }

  $scope.removeFriend = function(id) {
    UserService.deleteFriend(id, function(response) {
      $scope.refreshFriends();
    }, function(response) {
      console.log(response)
    });
  }

  $scope.createConv = function() {
    MessageService.createConv($scope.user.id, "", function(response) {
      $timeout(function() {
        $location.path('/message');
      }, 100);
    });
  }

  $scope.unstar = function(event) {
    EventService.UnstarEvent(event.id, function(response) {
      $scope.refreshActivities();
    }, function(response) {
      console.log("response")
    });
  }

  $scope.accept = function(com) {
    UserService.AcceptDemand(com.id, function(response) {
      $scope.refreshEventInvitations();
      $scope.refreshCommunityInvitations();
      $scope.refreshUserInvitations();
      $scope.refreshActivities();
      $scope.refreshFriends();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refuse = function(com) {
    UserService.DeleteDemand(com.id, function(response) {
      $scope.refreshEventInvitations();
      $scope.refreshCommunityInvitations();
      $scope.refreshUserInvitations();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.endorse = function() {
    UserService.endorse($scope.user.id, function(response) {
      $scope.refreshUser();
    }, function(response) {
      console.log(response);
    });
  };

  $scope.unendorse = function() {
    UserService.unendorse($scope.user.id, function(response) {
      $scope.refreshUser();
    }, function(response) {
      console.log(response);
    });
  };

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

}]);
