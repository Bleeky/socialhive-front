'use strict';

socialhive.controller('userAdminController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'EventService',
  'UserService', '$mdDialog', '$mdSidenav', 'Upload', '$timeout',
  function($scope, $rootScope, $location, AuthenticationService, EventService, UserService, $mdDialog, $mdSidenav, Upload, $timeout) {
    $scope.ADDR_USER_IMG = ADDR_USER_IMG;
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

    $scope.refreshPosts = function() {
      UserService.getUserPosts($scope.user.id, function(response) {
        $scope.user.posts = response;
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refreshUser = function() {
      UserService.getCurrentUser(function(response) {
        $scope.user = response;
        $scope.refreshPosts();
        $scope.progress = false;
        $scope.user.croppedDataUrl = "";
        $scope.user.croppedDataUrl2 = "";
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refreshUser();

    $scope.savePost = function() {
      $scope.editorData = $scope.editor.getDocument().toString();
      if ($scope.editorBoolEdit) {
        UserService.updateUserPost($scope.user.id, $scope.editorPostID, {
          "body": $scope.editorData
        }, function(response) {
          $scope.editorBool = false;
          $scope.editorBoolEdit = false;
          $scope.refreshPosts();
        }, function(response) {
          console.log(response);
        });
      } else {
        UserService.CreateUserPost($scope.user.id, {
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
      UserService.deleteUserPost($scope.user.id, id, function(response) {
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

    $scope.save = function() {
      $scope.progress = true;
      UserService.updateInfos($scope.user, function(response) {
        $scope.user.side_image0 = undefined;
        UserService.updateSettings($scope.user.id, $scope.user.settings, function(response) {
        }, function(response) {
          console.log(response);
        });
        $timeout(function() {
          $location.path('/user/' + $scope.user.id);
        }, 3000);
      }, function(response) {
        console.log(response);
      });
    }

    $scope.AddSideImages = function(file) {
      $scope.progress = true;
      Upload.dataUrl(file, true).then(function(url) {
        $scope.user.side_image0 = url;
        UserService.updateInfos($scope.user, function(response) {
          $scope.user.side_image0 = undefined;
          $timeout(function() {
            $scope.refreshUser();
          }, 3000);
        }, function(response) {
          console.log(response);
        });
      });
    }

    $scope.DeleteSideImage = function(index) {
      $scope.progress = true;
      UserService.deleteUserImages($scope.user.id, [$scope.user.side_images[index]], function(response) {
        $timeout(function() {
          $scope.refreshUser();
        }, 2000);
      }, function(response) {
        console.log(response);
        $scope.progress = false;
      });
    }
  }
]);
