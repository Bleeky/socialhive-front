socialhive.factory('XhrService', ['$rootScope', '$timeout',
    function ($rootScope, $timeout) {

      var service = {};
      var baseURL = ADDR_SERVER + ":" + PORT_SERVER + "";

      var StringToObject = function(text) {
        var obj = {};
        if (text != "") {
          obj = JSON.parse(text);
        }
        return obj;
      }

      service.post = function(url, form, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = StringToObject(this.responseText);
            if (this.status < 300) {
              $timeout(function () {
                success(obj);
              }, 100);
              return;
            }
            failure(obj);
          }
        });
        xhr.open("POST", baseURL+url);
        xhr.send(form);
      }

      service.put = function(url, form, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = StringToObject(this.responseText);
            if (this.status < 300) {
              $timeout(function () {
                success(obj);
              }, 100);
              return;
            }
            failure(obj);
          }
        });
        xhr.open("PUT", baseURL+url);
        xhr.send(form);
      }

      service.patch = function(url, form, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = StringToObject(this.responseText);
            if (this.status < 300) {
              $timeout(function () {
                success(obj);
              }, 100);
              return;
            }
            failure(obj);
          }
        });
        xhr.open("PATCH", baseURL+url);
        xhr.send(form);
      }

      service.delete = function(url, form, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = StringToObject(this.responseText);
            if (this.status < 300) {
              $timeout(function () {
                success(obj);
              }, 100);
              return;
            }
            failure(obj);
          }
        });
        xhr.open("DELETE", baseURL+url);
        xhr.send(form);
      }

      service.get = function(url, form, success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            var obj = StringToObject(this.responseText);
            if (this.status < 300) {
              $timeout(function () {
                success(obj);
              }, 100);
              return;
            }
            failure(obj);
          }
        });
        xhr.open("GET", baseURL+url);
        xhr.send(form);
      }

        return service;
    }]);
