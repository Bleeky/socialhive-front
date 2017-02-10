'use strict';

socialhive.controller('communityListController', ['$scope', '$rootScope', '$location', 'AuthenticationService', 'EventService', 'UserService', '$mdToast',
    function ($scope, $rootScope, $location, AuthenticationService, EventService, UserService, $mdToast) {
      $scope.ADDR_COMMUNITY_IMG = ADDR_COMMUNITY_IMG;
      $scope.progress = true;

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

      UserService.getComunities(function(response){
        $scope.communities = response;
        $scope.filter = {"my" : false};
        $scope.progress = false;
      }, function(response){
        $scope.progress = false;
        $scope.showSimpleToast("Error while gettings communities. Please reload.");
      });

    }
]);
