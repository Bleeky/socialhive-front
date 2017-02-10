socialhive.factory('UserService', ['$http', 'AuthenticationService', 'Upload', 'XhrService',
  function($http, AuthenticationService, Upload, XhrService) {
    var service = {};

    service.user = {};

    // DELETE /me

    service.deleteFriend = function(fid, success, failure) {
      XhrService.delete('/me/friend/' + fid, new FormData(), success, failure);
    }

    // GET /me

    service.getCurrentUser = function(success, failure) {
      var form = new FormData();
      XhrService.get('/me', form, function(response) {
        service.user = response;
        success(response);
      }, failure);
    };

    service.getCurrentUser(function(response){}, function(response){});

    service.requestEventSent = function(success, failure) {
      XhrService.get('/me/event/requests/sent', new FormData(), success, failure);
    }

    service.requestCommunitySent = function(success, failure) {
      XhrService.get('/me/community/requests/sent', new FormData(), success, failure);
    }

    service.invitationEventReceived = function(success, failure) {
      XhrService.get('/me/event/invites/pending', new FormData(), success, failure);
    }

    service.invitationCommunityReceived = function(success, failure) {
      XhrService.get('/me/community/invites/pending', new FormData(), success, failure);
    }

    service.friendRequest = function(success, failure) {
      XhrService.get('/me/friend/requests/pending', new FormData(), success, failure);
    }

    service.getNotifications = function(success, failure) {
      XhrService.get('/me/notifications', new FormData(), success, failure);
    }

    // PATCH /me

    service.AcceptDemand = function(id, success, failure) {
      XhrService.patch('/request/' + id + '/accept', new FormData(), success, failure);
    }

    service.DeleteDemand = function(id, success, failure) {
      XhrService.patch('/request/' + id + '/decline', new FormData(), success, failure);
    }

    // GET /notifications

    service.getNotifications = function(success, failure) {
      XhrService.get('/me/notifications', new FormData(), success, failure);
    }

    // PATCH /notifications

    service.seeNotifications = function(nid, success, failure) {
      XhrService.patch('/notification/' + nid + '/seen', new FormData(), success, failure);
    }

    // PATCH /invite

    service.AcceptInvite = function(id, success, failure) {
      XhrService.patch('/invite/' + id + '/accept', new FormData(), success, failure);
    }

    service.DeleteInvite = function(id, success, failure) {
      XhrService.patch('/invite/' + id + '/decline', new FormData(), success, failure);
    }

    // POST /community

    service.createCommunity = function(community, success, failure) { // failure not used
      var form = new FormData();
      form.append("name", community.name);
      form.append("description", community.description);
      if (community.croppedDataUrl2) {
        form.append("main_image", Upload.dataUrltoBlob(community.croppedDataUrl2, community.name));
      }
      if (community.croppedDataUrl) {
        form.append("cover_image", Upload.dataUrltoBlob(community.croppedDataUrl, community.name));
      }
      XhrService.post("/community", form, success, failure);
    }

    service.CreateCommunityPost = function(cid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.post('/community/' + cid + '/post', form, success, failure);
    }

    service.CreateCommunityPostComment = function(cid, pid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.post('/community/' + cid + '/post/' + pid + '/comment', form, success, failure);
    }

    service.CreateDemandMembership = function(cid, success, failure) {
      XhrService.post('/community/' + cid + '/join', new FormData(), success, failure);
    }

    service.InviteUserCommunity = function(cid, uid, success, failure) {
      XhrService.post('/community/' + cid + '/invite/' + uid, new FormData(), success, failure);
    }

    // PATCH /community

    service.EditCommunity = function(id, community, success, failure) {
      var form = new FormData();
      form.append("name", community.name);
      form.append("description", community.description);
      if (community.croppedDataUrl2) {
        form.append("main_image", Upload.dataUrltoBlob(community.croppedDataUrl2, community.name));
      }
      if (community.croppedDataUrl) {
        form.append("cover_image", Upload.dataUrltoBlob(community.croppedDataUrl, community.name));
      }
      if (community.side_image0) {
        form.append("side_image0", Upload.dataUrltoBlob(community.side_image0, community.name));
      }
      XhrService.patch("/community/" + id, form, success, failure);
    }

    service.updateCommunityPost = function(cid, pid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.patch('/community/' + cid + '/post/' + pid, form, success, failure);
    }

    service.updateCommunityPostComment = function(cid,pid,coid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.patch('/community/' + cid + '/post/' + pid + '/comment/' + coid, form, success, failure);
    }

    // DELETE /community

    service.DeleteCommunity = function(cid, success, failure) {
      XhrService.delete('/community/' + cid, new FormData(), success, failure);
    }

    service.DeleteSideImageCommunity = function(cid, imgs, success, failure) {
      var form = new FormData();
      form.append("main_image", false);
      form.append("cover_image", false);
      form.append("side_images", imgs.toString());
      XhrService.delete('/community/' + cid + '/image', form, success, failure);
    }

    service.DeleteUserFromCommunity = function(cid, uid, success, failure) {
      XhrService.delete('/community/' + cid + '/member/' + uid, new FormData(), success, failure);
    }

    service.DeletePostFromCommunity = function(cid, pid, success, failure) {
      XhrService.delete('/community/' + cid + '/post/' + pid, new FormData(), success, failure);
    }

    service.DeleteCommentFromCommunity = function(cid, pid, coid, success, failure) {
      XhrService.delete('/community/' + cid + '/post/' + pid + '/comment/' + coid, new FormData(), success, failure);
    }

    // GET /community

    service.getComunities = function(success, failure) {
      XhrService.get('/community', new FormData(), success, failure);
    }

    service.getComunitiesSpec = function(req, success, failure) {
      XhrService.get('/community' + req, new FormData(), success, failure);
    }

    service.getComunity = function(cid, success, failure) {
      XhrService.get('/community/' + cid, new FormData(), success, failure);
    }

    service.getCommunityEvents = function(cid, success, failure) {
      XhrService.get('/community/' + cid + '/events', new FormData(), success, failure);
    }

    service.getComunityPosts = function(cid, success, failure) {
      XhrService.get('/community/' + cid + '/posts', new FormData(), success, failure);
    }

    service.getCommunityPostComments = function(cid, pid, success, failure) {
      XhrService.get('/community/' + cid + '/post/' + pid + '/comments', new FormData(), success, failure);
    }

    service.getComunityInvitationSents = function(cid, success, failure) {
      XhrService.get('/community/' + cid + '/invites/sent', new FormData(), success, failure);
    }

    service.getComunityRequestsReceived = function(cid, success, failure) {
      XhrService.get('/community/' + cid + '/requests', new FormData(), success, failure);
    }

    // POST /user

    service.CreateUserPost = function(uid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.post('/user/' + uid + '/post', form, success, failure);
    }

    service.CreateUserPostComment = function(uid, pid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.post('/user/' + uid + '/post/' + pid + '/comment', form, success, failure);
    }

    service.AddFriend = function(uid, success, failure) {
      XhrService.post('/user/' + uid + '/befriend', new FormData(), success, failure);
    }

    // PATCH /user

    service.updateUserPost = function(uid, pid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.patch('/user/' + uid + '/post/' + pid, form, success, failure);
    }

    service.updateUserPostComment = function(uid, pid, coid, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.body);
      XhrService.patch('/user/' + uid + '/post/' + pid + '/comment/' + coid, form, success, failure);
    }

    service.updateInfos = function(user, success, failure) { // failure not used
      var form = new FormData();
      form.append("first_name", user.first_name);
      form.append("last_name", user.last_name);
      form.append("bio", user.bio);
      if (user.croppedDataUrl) {
        form.append("main_image", Upload.dataUrltoBlob(user.croppedDataUrl, user.first_name));
      }
      if (user.croppedDataUrl2) {
        form.append("cover_image", Upload.dataUrltoBlob(user.croppedDataUrl2, user.last_name));
      }
      if (user.side_image0) {
        form.append("side_image0", Upload.dataUrltoBlob(user.side_image0, user.last_name));
      }

      XhrService.patch("/user/" + user.id, form, success, failure);
    }

    service.endorse = function (id, success, failure) {
      XhrService.patch('/user/' + id + '/karma/good', new FormData, success, failure);
    }

    service.unendorse = function (id, success, failure) {
      XhrService.patch('/user/' + id + '/karma/bad', new FormData, success, failure);
    }

    service.updateSettings = function(uid, obj, success, failure) {
      var form = new FormData();
      form.append("email_notifs", obj.email_notifs);
      form.append("private", obj.private);
      XhrService.patch('/user/' + uid + '/settings', form, success, failure);
    }

    // DELETE /user

    service.deleteUserPost = function(uid, pid, success, failure) {
      XhrService.delete('/user/' + uid + '/post/' + pid, new FormData(), success, failure);
    }

    service.deleteUserPostComment = function(uid, pid, coid, success, failure) {
      XhrService.delete('/user/' + uid + '/post/' + pid + '/comment/' + coid, new FormData(), success, failure);
    }

    service.deleteUser = function(uid, success, failure) {
      XhrService.delete('/user/' + uid, new FormData(), success, failure);
    }

    service.deleteUserImages = function(uid, imgs, success, failure) {
      var form = new FormData();
      form.append("main_image", false);
      form.append("cover_image", false);
      form.append("side_images", imgs.toString());
      XhrService.delete('/user/' + uid + '/image', form, success, failure);
    }

    // GET /user

    service.getUser = function(uid, success, failure) {
      XhrService.get('/user/' + uid, new FormData(), success, failure);
    }

    service.getUsers = function(success, failure) {
      XhrService.get('/user', new FormData(), success, failure);
    }

    service.getUsersSpec = function(req, success, failure) {
      XhrService.get('/user' + req, new FormData(), success, failure);
    }

    service.getUserPosts = function(uid, success, failure) {
      XhrService.get('/user/' + uid + '/posts', new FormData(), success, failure);
    }

    service.getUserPostComments = function(uid, pid, i, success, failure) {
      XhrService.get('/user/' + uid + '/post/' + pid + '/comments', new FormData(), function(response) {
        response.i = i;
        success(response);
      }, failure);
    }

    service.getUserActivities = function(uid, success, failure) {
      XhrService.get('/user/' + uid + '/all', new FormData(), success, failure);
    }

    service.getUserBadges = function(uid, success, failure) {
      XhrService.get('/user/' + uid + '/badges', new FormData(), success, failure);
    }

    service.getUserFriends = function(uid, success, failure) {
      XhrService.get('/user/' + uid + '/friends', new FormData(), success, failure);
    }

    service.getSponsorEvents = function(uid, success, failure) {
      XhrService.get('/user/' + uid + '/sponsored', new FormData(), success, failure);
    }

    service.getSponsoringSent = function(uid, success, failure) {
      XhrService.get('/user/' + uid + '/sponsor/sent', new FormData(), success, failure);
    }

    // POST /conversation

    service.CreateConv = function(obj, success, failure) {
      var form = new FormData();
      form.append("target", obj.id);
      form.append("body", obj.msg);
      XhrService.post('/conversation', form, success, failure);
    }

    service.AddMessageConv = function(id, obj, success, failure) {
      var form = new FormData();
      form.append("body", obj.msg);
      XhrService.post('/conversation/' + id, form, success, failure);
    }

    service.AddParticipantConv = function(id, uid, obj, success, failure) {
      XhrService.post('/conversation/' + id + '/participant/' + uid, new FormData(), success, failure);
    }

    // DELETE /conversation

    service.DeleteConv = function(id, success, failure) {
      XhrService.delete('/conversation/' + id, new FormData(), success, failure);
    }

    service.DeleteParticipantConv = function(id, uid, success, failure) {
      XhrService.delete('/conversation/' + id + '/participant/' + uid, new FormData(), success, failure);
    }

    // POST /feedback

    service.createFeedback = function(msg, success, failure) {
      var form = new FormData();
      form.append("body", msg);
      XhrService.post('/feedback', form, success, failure);
    }

    return service;
  }
]);
