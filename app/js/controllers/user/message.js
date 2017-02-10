'use strict';

socialhive.controller('userMessageController', ['$scope', '$rootScope', '$location', '$timeout', '$interval', '$document', 'AuthenticationService', 'MessageService', 'UserService', '$mdDialog',
  function($scope, $rootScope, $location, $timeout, $interval, $document, AuthenticationService, MessageService, UserService, $mdDialog) {
    $scope.ADDR_USER_IMG = ADDR_USER_IMG;

    /*
     * Autocompletion stuff
     */
    $scope.querySearch = function(query) {
      var results = query ? $scope.users.filter($scope.createFilterFor(query)) : $scope.users;
      return results;
    }

    $scope.selectedItemChange = function(item) {
      $scope.target = item;
    }

    $scope.createFilterFor = function(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        var first_name = angular.lowercase(state.first_name);
        var last_name = angular.lowercase(state.last_name);
        var str = angular.lowercase(query);
        if (first_name == undefined || last_name == undefined) {
          return false;
        }
        return ((first_name.indexOf(str) === 0) || (last_name.indexOf(str) === 0));
      };
    }
    /***/

    $scope.refreshUsers = function() {
      UserService.getUsers(function(response) {
        $scope.users = response;
      }, function(response) {
        console.log(response);
      });

    }

    $scope.refreshUsers();

    $scope.createChat = function() {
      MessageService.createConv($scope.target.id, "", function(response) {
        $scope.refreshConv();
      }, function(response) {
        console.log(response);
      });
    }

    $scope.deleteConv = function(conv) {
      var confirm = $mdDialog.confirm()
          .textContent('Are you sure ?')
          .clickOutsideToClose(true)
          .ok('Confirm')
          .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        $scope.progress = true;
        MessageService.deleteConv(conv.id, function(response) {
          $scope.refreshConv();
          $scope.progress = false;
        }, function(response) {
          console.log(response);
          $scope.progress = true;
        })
      }, function() {});
    }

    /*
     * Refresh news message every 1 seconds.
     */
    $interval(function() {
      MessageService.getConversations(function(response) {
        for (var e = 0; e < response.length; e++) {
          var newConv = true;
          for (var i = 0; i < $scope.conversations.length; i++) {
            if ($scope.conversations[i].id == response[e].id) {
              $scope.conversations[i].messages = response[e].messages;
              newConv = false;
              break;
            }
          }
          if (newConv) {
            $scope.conversations.push(response[e])
          }
        }
      }, function(response) {
        console.log(response);
      });
    }, 1000);

    $scope.refreshConv = function() {
      MessageService.getConversations(function(response) {
        $scope.conversations = response;
        console.log(response);
        $scope.conversations.sort(function(a, b) {
          var keyA = new Date(a.last_updated),
            keyB = new Date(b.last_updated);
          if (keyA > keyB) return -1;
          if (keyA < keyB) return 1;
          return 0;
        });
      }, function(response) {
        console.log(response);
      });
    }

    $scope.refreshConv();

    $scope.sendMessage = function(conv) {
      if (conv.msg == undefined || conv.msg == "") {return;}
      MessageService.sendMessageConv(conv.id, conv.msg, function(response) {
        console.log("response");
        console.log(response);
        conv.msg = "";
      });
    }

    $scope.getSenderImage = function(conv, id) {
      for (var i = 0; i < conv.users.length; i++) {
        if (conv.users[i].id == id) {
          return conv.users[i].main_image;
        }
      }
    }

    /*
     * Add user / Kick / members modal.
     */
    $scope.showUsersConv = function(ev, conv) {
      $scope.conv_tmp = conv;
      $mdDialog.show({
        controller: function(scope) {
          /*
           * Forward declaration
           */
          scope.users = $scope.users;
          scope.conv = $scope.conv_tmp;
          scope.createFilterFor = $scope.createFilterFor;
          scope.querySearch = $scope.querySearch;
          /***/

          scope.selectedItemChange = function(item) {
            scope.target = item;
          }

          scope.cancel = function() {
            $mdDialog.hide();
          }

          scope.addUser = function() {
            console.log(scope.conv);
            console.log(scope.target);
            MessageService.addUserConv(scope.conv.id, scope.target.id, function(response) {
              scope.conv.users.push(scope.target);
              $scope.refreshConv();
            }, function(response) {
              console.log(response);
            });
          }

          scope.kick = function(index, user) {
            MessageService.deleteUserConv(scope.conv.id, user.id, function(response) {
              scope.conv.users.splice(index, 1);
              $scope.refreshConv();
            }, function(response) {
              console.log(response);
            });
          }
        },
        templateUrl: 'app/partials/user/message-dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };
  }
]);
