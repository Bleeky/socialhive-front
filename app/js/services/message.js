socialhive.factory('MessageService', ['$http', '$cookieStore', '$rootScope', '$location', 'XhrService',
  function($http, $cookieStore, $rootScope, $location, XhrService) {

    var service = {};

    // POST /conversation

    service.createConv = function(targetID, msg, success, failure) {
      var form = new FormData();
      form.append("target", targetID);
      form.append("body", msg);

      XhrService.post("/conversation", form, success, failure);
    };

    service.sendMessageConv = function(convID, msg, success, failure) {
      var form = new FormData();
      form.append("body", msg);

      XhrService.post("/conversation/" + convID, form, success, failure);
    };

    service.addUserConv = function(convID, userID, success, failure) {
      XhrService.post("/conversation/" + convID + "/participant/" + userID, new FormData(), success, failure);
    };

    // DELETE /conversation

    service.deleteConv = function(convID, success, failure) {
      XhrService.delete("/conversation/" + convID, new FormData(), success, failure);
    };

    service.deleteUserConv = function(convID, uid, success, failure) {
      console.log("Coucou");
      console.log(convID);
      console.log(uid);
      XhrService.delete("/conversation/" + convID + '/participant/' + uid, new FormData(), success, failure);
    };

    // GET /conversation

    service.getConversation = function(cid, success, failure) {
      XhrService.get('/conversation/' + cid, new FormData(), success, failure);
    }

    service.getConversations = function(success, failure) {
      XhrService.get('/me/conversations', new FormData(), success, failure);
    }

    return service;
  }
])
