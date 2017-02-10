'use strict';

socialhive.controller('eventParticipateController', ['$scope', '$rootScope', '$location', '$routeParams', 'AuthenticationService',
    'EventService', 'uiGmapGoogleMapApi', '$mdDialog', 'UserService',
    function ($scope, $rootScope, $location, $routeParams, AuthenticationService, EventService, uiGmapGoogleMapApi, $mdDialog, UserService) {
        $scope.ADDR_EVENT_IMG = ADDR_EVENT_IMG;

        /*
         * CHART LIB STUFF
         */
        $scope.labels = ['Furnished', 'Left'];
        $scope.colors = ['#ff9800', '#d3d3d3'];
        $scope.options = {
            showTooltips: false
        };
        /*
         * END OF chart lib stuff
         */

        UserService.getCurrentUser(function(response){
          $scope.user = response;
        }, function(response) {
          console.log(response);
        });

        EventService.GetEvent($routeParams.id, function (e) {
            $scope.e = e;
            /* Loop to add variable needed by the charts lib to work */
            if (e.needs) {
              for (var i = 0; i < e.needs.length; i++) {
                $scope.e.needs[i]["chart"] = [e.needs[i].acquired, (e.needs[i].quantity - e.needs[i].acquired), e.needs[i].quantity, 0, e.needs[i].acquired, (e.needs[i].quantity - e.needs[i].acquired)];
              }
            }
        });

        $scope.send = function() {
          $scope.progress = true;
          var contrib = [];
          if ($scope.e.needs) {
            for (var i = 0; i < $scope.e.needs.length; i++) {
              if ($scope.e.needs[i].chart[3] > 0) {
                contrib.push({"need_id" : $scope.e.needs[i].id, "quantity" : $scope.e.needs[i].chart[3]});
              }
            }
          }
          EventService.AskParticipation($routeParams.id, {"contribution" : contrib, "message" : $scope.message}, function(response){
            $location.path("/event/"+$routeParams.id);
          }, function(response){
            console.log(response);
          });
        }

        $scope.addParticipation = function (nb) {
            if (nb[3] < nb[2] && nb[0] < nb[2]) {
                nb[0]++;
                nb[3]++;
                nb[1]--;
            }
        };
        $scope.subParticipation = function (nb) {
            if (nb[3] > 0 && nb[0] > 0) {
                nb[0]--;
                nb[3]--;
                nb[1]++;
            }
        };

        $scope.updateNeed = function (data) {
            data[1] = data[5] - data[3];
            data[0] = data[4] + data[3];
            if (data[0] > data[2] || data[3] < 0) {
                data[3] = 0;
                data[0] = data[4];
                data[1] = data[5];
            }
        };
    }
]);
