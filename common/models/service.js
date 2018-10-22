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
          serv.subscriptions({where: {personId: fk}}, function(err, subs) {
            if (err) return cb(err);
            cb(null, {posts, subs});
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
          cb(null, err);
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
          serv.subscriptions({where: {postId: fk}}, function(err, subs) {
            if (err) return cb(err);
            cb(null, {people, subs});
          });
        });
      });
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

};
