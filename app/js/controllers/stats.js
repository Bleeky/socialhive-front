'use strict';

socialhive.controller('statsController', ['$scope', '$rootScope', '$location', '$timeout', '$interval', '$document', 'AuthenticationService', 'UserService',
    function($scope, $rootScope, $location, $timeout, $interval, $document, AuthenticationService, UserService) {

        $scope.isDisabled = false;
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
          $scope.series = ['Connections'];
          $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
          ];
          $scope.onClick = function (points, evt) {
            console.log(points, evt);
          };
          $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
          $scope.options = {
            scales: {
              yAxes: [
                {
                  id: 'y-axis-1',
                  type: 'linear',
                  display: true,
                  position: 'left'
                },
                {
                  id: 'y-axis-2',
                  type: 'linear',
                  display: true,
                  position: 'right'
                }
              ]
            }
          };
    }
]);
