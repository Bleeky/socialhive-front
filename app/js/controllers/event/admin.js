'use strict';

socialhive.controller('eventAdminController', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'AuthenticationService', 'EventService', 'uiGmapGoogleMapApi', '$mdDialog', 'UserService', 'Upload', function($scope, $rootScope, $location, $routeParams, $timeout, AuthenticationService, EventService, uiGmapGoogleMapApi, $mdDialog, UserService, Upload) {
  $scope.ADDR_USER_IMG = ADDR_USER_IMG;
  $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;
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

   UserService.getCurrentUser(function(response) {
     $scope.user = response;
   });

  $scope.refreshPosts = function() {
    EventService.GetPost($routeParams.id, function(response) {
      $scope.e.posts = response;
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshDemands = function() {
    EventService.GetDemands($routeParams.id, function(response) {
      $scope.e["demands"] = response;
      console.log(response);
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshSentInvite = function() {
    EventService.GetSentInvitation($routeParams.id, function(response) {
      $scope.sentInvite = response;
    }, function(response) {
      console.log(response);
    })
  }

  $scope.refreshSponsorRequest = function() {
    EventService.GetSponsorRequest($routeParams.id, function(response) {
      console.log("ponsorrequst");
      console.log(response);
      $scope.sponsorRequests = response;
    }, function(response) {

    });
  }

  $scope.refreshEvent = function() {
    EventService.GetEvent($routeParams.id, function(e) {
      if (e.creator.id != $scope.user.id) {
        $location.path('/');
      }
      $scope.e = e;
      $scope.e.newNeeds = [];
      $scope.e.croppedDataUrl = "";
      if ($scope.e.needs == undefined) {
        $scope.e.needs = [];
      }
      console.log($scope.e);
      $scope.refreshDemands();
      $scope.refreshPosts();
      $scope.refreshSentInvite();
      $scope.refreshSponsorRequest();
      $scope.progress = false;
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refreshEvent();

  UserService.getUsers(function(response) {
    $scope.allContacts = response;
  }, function(response) {
    console.log(response);
  });

  $scope.accept = function(d) {
    EventService.AcceptDemand(d.id, function(response) {
      $scope.refreshEvent();
      $scope.refreshDemands();
      $scope.refreshSponsorRequest();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.refuse = function(d) {
    EventService.DeleteDemand(d.id, function(response) {
      $scope.refreshEvent();
      $scope.refreshDemands();
      $scope.refreshSponsorRequest();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.kick = function(c) {
    EventService.DeleteUserFromEvent($routeParams.id, c.id, function(response) {
      $scope.refreshEvent();
    }, function(response) {
      console.log(response);
    })
  }

  var badEntries = function() {
    if ($scope.e.name == "" || $scope.e.name == undefined) {
      console.log("Oui");
      $scope.showSimpleToast("Name of the event is required.");
      return true;
    } else if ($scope.e.location.address == "" || $scope.e.location.address == undefined ||
      $scope.e.location.city == "" || $scope.e.location.city == undefined ||
      $scope.e.location.country == "" || $scope.e.location.country == undefined ||
      $scope.e.location.zip == "" || $scope.e.location.zip == undefined) {
      $scope.showSimpleToast("Adress of the event is required.")
      return true;
    }
    return false;
  }

  $scope.save = function() {
    if (badEntries()) {
      return;
    }
    $scope.progress = true;
    EventService.EditEvent($scope.e, function(response) {
      $timeout(function() {
        $location.path('/event/' + $routeParams.id);
      }, 3000);
    }, function(response) {
      console.log(response);
    });
  }

  $scope.deleteNeed = function(id) {
    EventService.DeleteNeed($scope.e.id, id, function(response) {
      console.log(response);
      $scope.refreshEvent();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.AddSideImages = function(file) {
    $scope.progress = true;
    Upload.dataUrl(file, true).then(function(url) {
      $scope.e.side_image0 = url;
      EventService.EditEvent($scope.e, function(response) {
        $scope.e.side_image0 = undefined;
        $timeout(function() {
          $scope.refreshEvent();
        }, 3000);
      }, function(response) {
        console.log(response);
      });
    });
  }

  $scope.DeleteSideImage = function(index) {
    $scope.progress = true;
    EventService.DeleteImages($scope.e.id, [$scope.e.side_images[index]], function(response) {
      $timeout(function() {
        $scope.refreshEvent();
      }, 2000);
    }, function(response) {
      console.log("Img deleted NOK");
      console.log(response);
      $scope.progress = false;
    });
  }

  $scope.savePost = function() {
    $scope.editorData = $scope.editor.getDocument().toString();
    if ($scope.editorBoolEdit) {
      EventService.EditPost($routeParams.id, $scope.editorPostID, $scope.editorData, function(response) {
        $scope.editorBool = false;
        $scope.editorBoolEdit = false;
        $scope.refreshPosts();
      }, function(response) {
        console.log(response);
      });
    } else {
      EventService.CreatePost($routeParams.id, $scope.editorData, function(response) {
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
    EventService.DeletePost($routeParams.id, id, function(response) {
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

  $scope.invite = function(contact) {
    EventService.InvitePeople($routeParams.id, contact.id, function(response) {
      contact.sent = true;
      $scope.refreshSentInvite();
    }, function(response) {
      console.log(response);
    });
  }

  $scope.delete = function() {
    EventService.DelEvent($routeParams.id, function(response) {
      $location.path('/#/event/list');
    }, function(response) {
      console.log(response);
    });
  }

  $scope.addNeed = function() {
    $scope.e.newNeeds.push({
      name: "",
      quantity: 1,
      optional: false,
      description: "",
      type: "",
    });
  }

  $scope.removeNeed = function(index) {
    $scope.e.newNeeds.splice(index, 1);
  }

  /*
   * Need modal
   */
  $scope.showNeeds = function(request) {
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
  /***/
}]);
