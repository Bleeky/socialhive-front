'use strict';

socialhive.controller('communityAdminController', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'AuthenticationService', 'EventService', 'UserService', 'Upload',
  function($scope, $rootScope, $location, $routeParams, $timeout, AuthenticationService, EventService, UserService, Upload) {
    $scope.ADDR_USER_IMG = ADDR_USER_IMG;
    $scope.ADDR_COMMUNITY_IMG = ADDR_COMMUNITY_IMG;
    /*
     * Trix Editor stuff
     */
    $scope.editorBool = false;
    $scope.editorBoolEdit = false;
    $scope.editorData = "";

    $scope.trixInit = function(e, editor) {
      $scope.editor = editor;
    }

    $scope.openEditor = function() {
      $scope.editorBool = true;
    };

    $scope.closeEditor = function() {
      $scope.editorBool = false;
      $scope.editorBoolEdit = false;
    };
    /*
     * END OF Trix Editor stuff
     */

    $scope.pendingInviteFilter = function(contact) {
      if ($scope.sentInvite) {
        for (var i = 0; i < $scope.sentInvite.length; i++) {
          if (contact.id == $scope.sentInvite[i].guest.id) {
            return false;
          }
        }
      }
      return true;
    }

    $scope.sponsorFilter = function(contact) {
      if (contact.is_sponsor) {
        return false;
      }
      return true;
    }

    UserService.getUsers(function(response) {
      $scope.allContacts = response;
    }, function(response) {
      console.log(response);
    });

    UserService.getCurrentUser(function(response) {
      $scope.user = response;
    });

    $scope.refreshRequest = function() {
      UserService.getComunityRequestsReceived($routeParams.id, function(response) {
        $scope.requests = response;
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refreshSentInvite = function() {
      UserService.getComunityInvitationSents($routeParams.id, function(response) {
        $scope.sentInvite = response;
      }, function(response) {
        console.log(response);
      })
    }

    $scope.refreshPosts = function() {
      UserService.getComunityPosts($routeParams.id, function(response) {
        $scope.community.posts = response;
      }, function(response) {
        console.log(response);
      })
    };

    $scope.refreshCommunity = function() {
      UserService.getComunity($routeParams.id, function(response) {
        if (response.admin.id != $scope.user.id) {
          $location.path('/');
        }
        $scope.community = response;
        $scope.refreshRequest();
        $scope.refreshPosts();
        $scope.refreshSentInvite();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refreshCommunity();

    $scope.updateComu = function() {
      $scope.progress = true;
      UserService.EditCommunity($scope.community.id, $scope.community, function(response) {
        $timeout(function() {
          $location.path("/community/" + $scope.community.id);
        }, 3000);
      }, function(response) {
        $scope.progress = false;
        console.log(response);
      });
    }

    $scope.savePost = function() {
      $scope.editorData = $scope.editor.getDocument().toString();
      if ($scope.editorBoolEdit) { // Edition
        UserService.updateCommunityPost($routeParams.id, $scope.editorPostID, {
          "body": $scope.editorData
        }, function(response) {
          $scope.editorBool = false;
          $scope.editorBoolEdit = false;
          $scope.refreshPosts();
        }, function(response) {
          console.log(response);
        });
      } else { // Creation
        UserService.CreateCommunityPost($routeParams.id, {
          "body": $scope.editorData
        }, function(response) {
          $scope.editorBool = false;
          $scope.editorBoolEdit = false;
          $scope.refreshPosts();
        }, function(response) {
          console.log(response);
        });
      }
      $scope.editorData = "";
    }

    $scope.deletePost = function(id) {
      UserService.DeletePostFromCommunity($routeParams.id, id, function(response) {
        $scope.refreshPosts();
      }, function(response) {
        console.log(response);
      })
    }

    $scope.editPost = function(post) {
      $scope.editorBoolEdit = true;
      $scope.editorBool = true;
      $scope.editorData = post.body;
      $scope.editorPostID = post.id;
    }

    $scope.AddSideImages = function(file) {
      $scope.progress = true;
      Upload.dataUrl(file, true).then(function(url) {
        $scope.community.side_image0 = url;
        UserService.EditCommunity($scope.community.id, $scope.community, function(response) {
          $scope.community.side_image0 = undefined;
          $timeout(function() {
            $scope.refreshCommunity();
            $scope.progress = false;
          }, 3000);
        }, function(response) {
          $scope.progress = false;
          console.log(response);
        });
      });

    }

    $scope.DeleteSideImage = function(index) {
      UserService.DeleteSideImageCommunity($routeParams.id, [$scope.community.side_images[index]], function() {
        $scope.refreshCommunity();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.invite = function(contact) {
      UserService.InviteUserCommunity($routeParams.id, contact.id, function(response) {
        contact.sent = true;
        $scope.refreshSentInvite();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.deleteUser = function(contact) {
      UserService.DeleteUserFromCommunity($routeParams.id, contact.id, function(response) {
        $scope.refreshCommunity();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.accept = function(d) {
      EventService.AcceptDemand(d.id, function(response) {
        $scope.refreshCommunity();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refuse = function(d) {
      EventService.DeleteDemand(d.id, function(response) {
        $scope.refreshCommunity();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.delete = function() {
      UserService.DeleteCommunity($routeParams.id, function(response) {
        $location.path('/event/list');
      }, function(response) {
        console.log(response);
      });
    }
  }
]);
