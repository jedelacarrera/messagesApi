'use strict';

module.exports = function(Service) {
  // Hide methods
  Service.disableRemoteMethodByName('patchOrCreate');
  Service.disableRemoteMethodByName('replaceOrCreate');
  Service.disableRemoteMethodByName('exists');
  Service.disableRemoteMethodByName('count');
  Service.disableRemoteMethodByName('findOne');
  Service.disableRemoteMethodByName('replaceById');
  Service.disableRemoteMethodByName('updateAll');
  Service.disableRemoteMethodByName('upsertWithWhere');
  Service.disableRemoteMethodByName('createChangeStream');
  Service.disableRemoteMethodByName('prototype.__delete__people');
  Service.disableRemoteMethodByName('prototype.__delete__posts');
  Service.disableRemoteMethodByName('prototype.__create__posts');
  Service.disableRemoteMethodByName('prototype.__create__subscriptions');
  Service.disableRemoteMethodByName('prototype.__delete__subscriptions');
  Service.disableRemoteMethodByName('prototype.__updateById__subscriptions');

  // Custom methods: Handlers
  Service.userSubscriptions = function(id, fk, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.people.findById(fk, function(err, person) {
        if (err) return cb(err);
        person.subscribedPosts({}, function(err, posts) {
          if (err) return cb(err);
          serv.subscriptions({where: {personId: fk}}, function(err, notifications) {
            if (err) return cb(err);
            cb(null, {posts, notifications});
          });
        });
      });
    });
  }
  Service.newSubscription = function(id, fkperson, fkpost, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.people.findById(fkperson, function(err, person) {
        if (err) return cb(err);
        const sub = person.subscriptions.build();
        try {
          sub.postId = fkpost;
          sub.save();
          cb(null, sub);
        } catch (err) {
          cb(err);
        }
      });
    });
  }
  Service.postSubscriptions = function(id, fk, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.posts.findById(fk, function(err, post) {
        if (err) return cb(err);
        post.subscribedPeople({}, function(err, people) {
          if (err) return cb(err);
          serv.subscriptions({where: {postId: fk}}, function(err, notifications) {
            if (err) return cb(err);
            cb(null, {people, notifications});
          });
        });
      });
    });
  }
  Service.getMessages = function(id, fk, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.posts.findById(fk, function(err, post) {
        if (err) return cb(err);
        post.messages({}, function(err, msgs) {
          if (err) return cb(err);
          cb(null, msgs)
        });
      });
    });
  }
  Service.newMessage = function(id, fkpost, fkauthor, data, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.posts.findById(fkpost, function(err, post) {
        if (err) return cb(err);
        const msg = post.messages.build(data);
        try {
          msg.personId = fkauthor;
          msg.save();
          cb(null, msg);
        } catch (err) {
          cb(err);
        }
      });
    });
  }
  Service.getSingleMessage = function(id, fkpost, fkmessage, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.posts.findById(fkpost, function(err, post) {
        if (err) return cb(err);
        post.messages.findById(fkmessage, function(err, msg) {
          if (err) return cb(err);
          cb(null, msg);
        });
      });
    });
  }
  Service.getReplies = function(id, fkpost, fkmessage, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.posts.findById(fkpost, function(err, post) {
        if (err) return cb(err);
        post.messages.findById(fkmessage, function(err, msg) {
          if (err) return cb(err);
          msg.responses({}, function(err, rsps) {
            if (err) return cb(err);
            cb(null, rsps);
          });
        });
      });
    });
  }
  Service.newReply = function(id, fkpost, fkmessage, fkauthor, data, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.posts.findById(fkpost, function(err, post) {
        if (err) return cb(err);
        post.messages.findById(fkmessage, function(err, msg) {
          if (err) return cb(err);
          const rsp = msg.responses.build(data);
          try {
            rsp.personId = fkauthor;
            rsp.save();
            cb(null, rsp);
          } catch (err) {
            cb(err);
          }
        });
      });
    });
  }
  Service.getSingleReply = function(id, fkpost, fkmessage, fkresponse, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      serv.posts.findById(fkpost, function(err, post) {
        if (err) return cb(err);
        post.messages.findById(fkmessage, function(err, msg) {
          if (err) return cb(err);
          msg.responses.findById(fkresponse, function(err, rsp) {
            if (err) return cb(err);
            cb(null, rsp);
          });
        });
      });
    });
  }
  Service.newPost = function(id, fk, data, cb) {
    Service.findById(id, function(err, serv) {
      if (err) return cb(err);
      const pst = serv.posts.build(data);
      try {
        pst.personId = fk;
        pst.save();
        cb(null, pst);
      } catch (err) {
        cb(err);
      }
    });
  }

  // Custom methods: Register
  Service.remoteMethod('userSubscriptions', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fk", type: "string", root: true, required: true, description: "Foreign key for people", http: {source: "path"}}
    ],
    returns: {type: "object", root: true},
    description: "List all publications in which the user is subscribed",
    http: {
      path: "/:id/people/:fk/subscriptions",
      verb: "get",
      status: 200,
      errorStatus: 400
    }
  });
  Service.remoteMethod('newSubscription', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fkperson", type: "string", root: true, required: true, description: "Foreign key for people", http: {source: "path"}},
      {arg: "fkpost", type: "string", root: true, required: true, description: "Foreign key for people", http: {source: "path"}}
    ],
    returns: {type: "object", root: true},
    description: "Allows you to subscribe a user for a post",
    http: {
      path: "/:id/people/:fkperson/subscriptions/posts/:fkpost",
      verb: "post",
      status: 201,
      errorStatus: 400
    }
  });
  Service.remoteMethod('postSubscriptions', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fk", type: "string", root: true, required: true, description: "Foreign key for post", http: {source: "path"}}
    ],
    returns: {type: "object", root: true},
    description: "List all users who have subscribed to the post",
    http: {
      path: "/:id/posts/:fk/subscriptions",
      verb: "get",
      status: 200,
      errorStatus: 400
    }
  });
  Service.remoteMethod('getMessages', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fk", type: "string", root: true, required: true, description: "Foreign key for post", http: {source: "path"}}
    ],
    returns: {type: "object", root: true},
    description: "List all existing messages from a post",
    http: {
      path: "/:id/posts/:fk/messages",
      verb: "get",
      status: 200,
      errorStatus: 400
    }
  });
  Service.remoteMethod('newMessage', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fkpost", type: "string", root: true, required: true, description: "Foreign key for post", http: {source: "path"}},
      {arg: "fkauthor", type: "string", root: true, required: true, description: "Foreign key for author", http: {source: "path"}},
      {arg: "data", type: "object", http: {source: "body"}}
    ],
    returns: {type: "object", root: true},
    description: "Allows you to create a new message",
    http: {
      path: "/:id/posts/:fkpost/messages/author/:fkauthor",
      verb: "post",
      status: 201,
      errorStatus: 400
    }
  });
  Service.remoteMethod('getSingleMessage', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fkpost", type: "string", root: true, required: true, description: "Foreign key for post", http: {source: "path"}},
      {arg: "fkmessage", type: "string", root: true, required: true, description: "Foreign key for message", http: {source: "path"}}
    ],
    returns: {type: "object", root: true},
    description: "Shows a message information",
    http: {
      path: "/:id/posts/:fkpost/messages/:fkmessage",
      verb: "get",
      status: 200,
      errorStatus: 400
    }
  });
  Service.remoteMethod('getReplies', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fkpost", type: "string", root: true, required: true, description: "Foreign key for post", http: {source: "path"}},
      {arg: "fkmessage", type: "string", root: true, required: true, description: "Foreign key for message", http: {source: "path"}}
    ],
    returns: {type: "object", root: true},
    description: "List all existing responses for a message",
    http: {
      path: "/:id/posts/:fkpost/messages/:fkmessage/responses",
      verb: "get",
      status: 200,
      errorStatus: 400
    }
  });
  Service.remoteMethod('newReply', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fkpost", type: "string", root: true, required: true, description: "Foreign key for post", http: {source: "path"}},
      {arg: "fkmessage", type: "string", root: true, required: true, description: "Foreign key for message", http: {source: "path"}},
      {arg: "fkauthor", type: "string", root: true, required: true, description: "Foreign key for author", http: {source: "path"}},
      {arg: "data", type: "object", http: {source: "body"}}
    ],
    returns: {type: "object", root: true},
    description: "Allows you to create a new response",
    http: {
      path: "/:id/posts/:fkpost/messages/:fkmessage/responses/author/:fkauthor",
      verb: "post",
      status: 201,
      errorStatus: 400
    }
  });
  Service.remoteMethod('getSingleReply', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fkpost", type: "string", root: true, required: true, description: "Foreign key for post", http: {source: "path"}},
      {arg: "fkmessage", type: "string", root: true, required: true, description: "Foreign key for message", http: {source: "path"}},
      {arg: "fkresponse", type: "string", root: true, required: true, description: "Foreign key for response", http: {source: "path"}}
    ],
    returns: {type: "object", root: true},
    description: "Shows a response information",
    http: {
      path: "/:id/posts/:fkpost/messages/:fkmessage/responses/:fkresponse",
      verb: "get",
      status: 200,
      errorStatus: 400
    }
  });
  Service.remoteMethod('newPost', {
    accepts: [
      {arg: "id", type: "string", root: true, required: true, description: "service id", http: {source: "path"}},
      {arg: "fk", type: "string", root: true, required: true, description: "Foreign key for author", http: {source: "path"}},
      {arg: "data", type: "object", http: {source: "body"}}
    ],
    returns: {type: "object", root: true},
    description: "Allows you to create a new post",
    http: {
      path: "/:id/posts/author/:fk",
      verb: "post",
      status: 201,
      errorStatus: 400
    }
  });

};
