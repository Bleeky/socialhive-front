socialhive.directive('shNav', ['$location', 'AuthenticationService', 'UserService', '$mdSidenav', '$rootScope', '$document', '$mdDialog', '$mdToast', '$timeout', 'XhrService', '$interval', function($location, AuthenticationService, UserService, $mdSidenav, $rootScope, $document, $mdDialog, $mdToast, $timeout, XhrService, $interval) {
  return {
    templateUrl: 'app/partials/sh-nav.html',
    link: function(scope, element, attrs) {
      scope.ADDR_USER_IMG = ADDR_USER_IMG;

      /*
       * Toast notif stuff
       */
      scope.showSimpleToast = function(str) {
        $mdToast.show(
          $mdToast.simple()
          .textContent(str)
          .hideDelay(10000)
        );
      };
      /***/

      /*
       * Feedback prompt
       */
      scope.showPromptFeedback = function() {
        $mdDialog.show({
          contentElement: '#myStaticDialog',
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      };

      scope.closeDialog = function() {
        $mdDialog.hide();
      }
      /***/

      /*
       * Notifications panel
       */
       scope.panel = false;
       scope.showOptions = function() {
         scope.panel = !scope.panel;
       };

       element.bind('click', function(event) {
         event.stopPropagation();
       });

       $document.bind('click', function() {
         scope.panel = false;
         scope.$apply();
       });
       /***/

       AuthenticationService.isLog(function(response) {
         scope.refreshUser();
         scope.refreshNotifications();
       }, function(response) {
       });

       /*
        * Refresh notifications every 8 seconds.
        */
       $interval(function() {
         if (scope.me != undefined && scope.me.is_sponsor != true) {
           scope.refreshNotifications();
         }
       }, 8000);
       /***/

       scope.$on("$routeChangeSuccess", function (event, current, previous) {
         if (previous && (previous.loadedTemplateUrl == "app/partials/login.html" || previous.loadedTemplateUrl == "app/partials/user/admin.html")) {
           scope.refreshUser();
         }
       });


      scope.refreshUser = function() {
        UserService.getCurrentUser(function(response) {
          scope.me = response;
        }, function(response) {
          console.log(response);
        });
      }

      scope.refreshNotifications = function() {
        UserService.getNotifications(function(response) {
          scope.notifications = response;
        }, function(response) {
          console.log(response);
        });
      }

      scope.login = function(user, pass) {
        if (user == undefined) {user = scope.email;pass = scope.password;}
        scope.progress = true;
        AuthenticationService.Login(user, pass,
          function(data) {
            $timeout(function() {
              scope.refreshUser();
              scope.progress = false;
              $location.path('/event/list');
            }, 3000);
          },
          function(data) { /* Failure callback */
            /* Error Login */
            scope.progress = false;
            var msg = data.cause || data.error;
            scope.showSimpleToast(msg);
            scope.password = ""; /* TODO : Select string and don't delete */
          });
      }

      scope.logout = function() {
        AuthenticationService.Logout();
        scope.me = undefined;
      }

      scope.feedback = function() {
        UserService.createFeedback(scope.feedbackMSG, function(response) {
          scope.feedbackMSG = "";
          $mdDialog.hide();
          scope.showSimpleToast("Feedback sent");
        }, function(response) {
          console.log(response);
        });
      }
    }
  };
}]);
