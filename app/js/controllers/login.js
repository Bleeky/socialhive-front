var funcFB;
socialhive.controller('loginController', ['$scope', '$rootScope', '$location', '$http', 'AuthenticationService', '$mdSidenav', 'Upload', '$mdToast', 'XhrService', '$mdDialog',
      function($scope, $rootScope, $location, $http, AuthenticationService, $mdSidenav, Upload, $mdToast, XhrService, $mdDialog) {
        $scope.new = {};

        /*
         * Toast stuff
         */
        $scope.showSimpleToast = function(str) {
          $mdToast.show(
            $mdToast.simple()
            .textContent(str)
            .hideDelay(10000)
          );
        };
        /***/

        /*
         * Cropping modal
         */
        $scope.showImgDialog = function() {
          $scope.showCropped = false;
          $mdDialog.show({
            contentElement: '#imagePop',
            parent: angular.element(document.body),
            clickOutsideToClose: true
          });
        };

        $scope.validateImg = function() {
          console.log($scope.croppedDataUrlTmp);
          $scope.showCropped = true;
          $scope.picFile = undefined;
          $mdDialog.hide();
        }

        $scope.closeDialog = function() {
            $scope.picFile = undefined;
            $mdDialog.hide();
          }
          /***/

        $scope.facebookConnect = function() {
          AuthenticationService.getUserFacebookInfo(function(response) {
            var facebookInfo = response;
            AuthenticationService.Login(facebookInfo.id + "@facebook.com", facebookInfo.id, function(response) {
              $location.path('/event/list');
            }, function(response) {
              AuthenticationService.SignUp({"email" : facebookInfo.id + "@facebook.com",
                            "password" : facebookInfo.id,
                            "first_name" : facebookInfo.first_name,
                            "last_name" : facebookInfo.last_name,
                            "is_sponsor" : false},
                function(response) {
                  $scope.facebookConnect();
                }, function(response) {
                  console.log(response);
                });
            });
          });
        }
        funcFB = $scope.facebookConnect;

        var badEntries = function() {
          if ($scope.new.email != $scope.emailCheck) {
            $scope.showSimpleToast("Emails are not equal.");
          } else if ($scope.new.email == "" || $scope.new.email == undefined) {
            $scope.showSimpleToast("Email is required.");
          } else if ($scope.new.first_name == "" || $scope.new.first_name == undefined) {
            $scope.showSimpleToast("First name is required.");
          } else if ($location.path() == "/" && ($scope.new.last_name == "" || $scope.new.last_name == undefined)) {
            $scope.showSimpleToast("Last name is required.");
          } else if ($scope.new.password == "" || $scope.new.password == undefined) {
            $scope.showSimpleToast("password is required.");
          } else {
            return false;
          }
          return true;
        }

        $scope.signup = function() {
          if (badEntries()) {
            return;
          }
          $scope.progress = true;
          if ($scope.croppedDataUrl != undefined || $scope.croppedDataUrl != '') {
            $scope.new.img = $scope.croppedDataUrl;
          }
          if ($location.path() == "/sponsor/signup") {
            $scope.new.is_sponsor = true;
          } else {$scope.new.is_sponsor = false;}
          AuthenticationService.SignUp($scope.new, function(response) {
            $scope.progress = false;
            $scope.login($scope.new.email, $scope.new.password);
          }, function(response) {
            $scope.progress = false;
            $scope.showSimpleToast(response.cause);
            console.log(response);
          });
        }
      }
      ]);
