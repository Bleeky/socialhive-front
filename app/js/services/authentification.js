socialhive.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', '$location', 'XhrService', 'Upload',
  function($http, $cookieStore, $rootScope, $location, XhrService, Upload) {

    var service = {};

    service.Login = function(username, password, success, failure) {
      var form = new FormData();
      form.append("email", username);
      form.append("hash", password);
      XhrService.post('/auth/login', form, success, failure);
    };

    service.Logout = function() {
      XhrService.post('/auth/logout', new FormData(), function(response) {
        $location.path('/');
      }, function(response) {});
    };

    service.isLog = function(success, failure) {
      XhrService.get('/auth/check', new FormData(), success, failure);
    };

    service.SignUp = function(userObj, success, failure) {
      var form = new FormData();
      form.append("email", userObj.email);
      form.append("hash", userObj.password);
      form.append("first_name", userObj.first_name);
      if (userObj.last_name != undefined || userObj.last_name != "") {
        form.append("last_name", userObj.last_name);
      }
      form.append("bio", "This user didn't write summary yet.");
      form.append("is_sponsor", userObj.is_sponsor);
      if (userObj.img) {
        form.append("main_image", Upload.dataUrltoBlob(userObj.img, name));
      }
      XhrService.post("/auth/signup", form, success, failure);
    }

    /*
     * Facebook stuff
     */
    service.getUserFacebookInfo = function(callback) {
      FB.api('/me', {
        fields: 'email,last_name,first_name,picture,cover'
      }, function(res) {
        callback(res);
      });
    }
    /***/

    return service;
  }
]);
