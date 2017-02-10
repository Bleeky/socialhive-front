socialhive.factory('EventService', ['$http', '$rootScope', 'Upload', 'XhrService',
  function($http, $rootScope, Upload, XhrService) {
    var service = {};

    // POST /event

    service.AddEvent = function(event, success, failure) {
      var form = new FormData();
      var ds = new Date(event.date);
      var de = new Date(event.end);

      form.append("name", event.name);
      form.append("start_date", ds.toISOString());
      form.append("end_date", de.toISOString());
      form.append("location.city", event.location.city);
      form.append("location.zip", event.location.zip);
      form.append("location.address", event.location.address);
      form.append("location.country", event.location.country);
      form.append("description", event.description);
      form.append("private", event.private);
      form.append("type", event.type);
      if (event.croppedDataUrl) {
        form.append("main_image", Upload.dataUrltoBlob(event.croppedDataUrl, event.name));
      }
      // Cover image
      if (event.community) {
        form.append("community_id", event.community);
      }

      XhrService.post("/event", form, function(response) {
        console.log(response);
        service.AddNeedsToEvent(response.id, event.needs, success, failure);
      }, function(response) {
        failure(response);
      });
    };

    service.AddNeedsToEvent = function(id, needs, success, failure) {
      if (needs.length > 0) {
        $http.post(ADDR_SERVER + ':' + PORT_SERVER + '/event/' + id + '/need', {
          'needs': needs,
        }).
        then(function(response) {
          response.id = id;
          success(response);
        }, function(response) {
          failure(response);
        });
      } else {
        success({"id":id});
      }
    };

    service.CreatePost = function(id, body, success, failure) {
      var form = new FormData();
      form.append("body", body);
      XhrService.post('/event/' + id + '/post', form, success, failure);
    }

    service.PostCom = function(id, postId, body, success, failure) {
      var form = new FormData();
      form.append("body", body);
      XhrService.post('/event/' + id + '/post/' + postId + '/comment', form, success, failure);
    }

    service.InvitePeople = function(eid, uid, success, failure) {
      XhrService.post('/event/' + eid + '/invite/' + uid, new FormData(), success, failure);
    }

    service.AskParticipation = function(id, ask, success, failure) { /* Le champs ask.contrib ne sera pas bon pour la route */
      $http.post(ADDR_SERVER + ':' + PORT_SERVER + '/event/' + id + '/participate', {
        'contribution': ask.contribution,
        'message': ask.message,
      }).
      then(function(response) {
        success(response);
      }, function(response) {
        failure(response);
      });
    }

    service.StarEvent = function(eid, success, failure) {
      XhrService.post('/event/' + eid + '/star', new FormData(), success, failure);
    }

    service.UnstarEvent = function(eid, success, failure) {
      XhrService.post('/event/' + eid + '/unstar', new FormData(), success, failure);
    }

    service.sponsorParticipate = function(eid, ask, success, failure) {
      $http.post(ADDR_SERVER + ':' + PORT_SERVER + '/event/' + eid + '/sponsor', {
        'contribution': ask.contribution,
        'message': ask.message,
      }).
      then(function(response) {
        success(response);
      }, function(response) {
        failure(response);
      });
    }

    // PATCH /event


    service.EditEvent = function(event, success, failure) {
      var form = new FormData();
      var ds = new Date(event.start_date);
      var de = new Date(event.end_date);

      form.append("name", event.name);
      form.append("start_date", ds.toISOString());
      form.append("end_date", de.toISOString());
      form.append("location.city", event.location.city);
      form.append("location.zip", event.location.zip);
      form.append("location.address", event.location.address);
      form.append("location.country", event.location.country);
      form.append("description", event.description);
      form.append("private", event.private);
      form.append("type", event.type);
      if (event.croppedDataUrl) {
        form.append("main_image", Upload.dataUrltoBlob(event.croppedDataUrl, event.name));
      }
      if (event.side_image0) {
        form.append("side_image0", Upload.dataUrltoBlob(event.side_image0, event.name));
      }
      if (event.community) {
        form.append("communityid", event.community);
      }

      XhrService.patch("/event/" + event.id, form, function(response) {
        service.EditNeedsToEvent(event, response, success, failure);
        // success(response);
      }, function(response) {
        failure(response);
      });
    };

    service.EditNeedsToEvent = function(event, response, success, failure) {
      for (var i = 0; i < event.needs.length; i++) {
        var form = new FormData();
        form.append("name", event.needs[i].name);
        form.append("description", event.needs[i].description);
        form.append("type", "");
        form.append("quantity", event.needs[i].quantity);
        XhrService.patch("/event/" + event.id + "/need/" + event.needs[i].id, form, function(response) {
        }, function(response) {
          console.log("Edit Need failure:")
          console.log(response);
        });
      }
      service.AddNeedsToEvent(event.id, event.newNeeds, success, failure)
    };

    service.EditPostComment = function(eid, pid, cid, body, success, failure) {
      var form = new FormData();
      form.append('body', body);
      XhrService.patch('/event/' + eid + '/post/' + pid + '/comment/' + cid, form, success, failure);
    }

    service.EditPost = function(eid, pid, body, success, failure) {
      var form = new FormData();
      form.append('body', body);
      XhrService.patch('/event/' + eid + '/post/' + pid, form, success, failure);
    }

    // DELETE /event

    service.DelEvent = function(eid, success, failure) {
      XhrService.delete('/event/' + eid, new FormData(), success, failure);
    };

    service.DeleteImages = function(eid, sides, success, failure) {
      var form = new FormData();
      form.append("main_image", false);
      form.append("cover_image", false);
      form.append("side_images", sides.toString());
      XhrService.delete('/event/' + eid + '/image', form, success, failure);
    }

    service.DeletePost = function(eid, pid, success, failure) {
      XhrService.delete('/event/' + eid + '/post/' + pid, new FormData(), success, failure);
    }

    service.DeletePostCom = function(eid, pid, cid, success, failure) {
      XhrService.delete('/event/' + eid + '/post/' + pid + '/comment/' + cid, new FormData(), success, failure);
    }

    service.DeleteUserFromEvent = function(eid, uid, success, failure) {
      XhrService.delete('/event/' + eid + '/participant/' + uid, new FormData(), success, failure);
    }

    service.DeleteNeed = function(eid, nid, success, failure) {
      XhrService.delete('/event/' + eid + '/need/' + nid, new FormData(), success, failure);
    }

    // GET /event

    service.GetEvents = function(success, failure) {
      XhrService.get('/event', new FormData(), success, failure);
    };

    service.GetEventsSpec = function(req, success, failure) {
      XhrService.get('/event' + req, new FormData(), success, failure);
    };

    service.GetEvent = function(eid, success, failure) {
      XhrService.get('/event/' + eid, new FormData(), function(response) {
        success(response);
      }, failure);
    };

    service.GetPost = function(eid, success, failure) {
      XhrService.get('/event/' + eid + '/posts', new FormData(), success, failure);
    }

    service.GetSentInvitation = function(eid, success, failure) {
      XhrService.get('/event/' + eid + '/invites/sent', new FormData(), success, failure);
    }

    service.GetDemands = function(eid, success, failure) {
      XhrService.get('/event/' + eid + '/requests', new FormData(), success, failure);
    }

    service.GetCom = function(eid, pid, i, success, failure) {
      XhrService.get('/community/' + eid + '/post/' + pid + '/comments', new FormData(), function(response) {
        response["i"] = i;
        success(response);
      }, failure);
    }

    service.GetSponsorRequest = function(eid, success, failure) {
      XhrService.get('/event/' + eid + '/sponsor/pending', new FormData(), success, failure);
    }

    // SPECIAL

    service.AcceptDemand = function(id, success, failure) {
      XhrService.patch('/request/' + id + '/accept', new FormData(), success, failure);
    }

    service.DeleteDemand = function(id, success, failure) {
      XhrService.patch('/request/' + id + '/decline', new FormData(), success, failure);
    }

    return service;
  }
]);
