'use strict';

module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('USER', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    var userId = context.accessToken.userId;
    if (!userId) return reject();

    console.log(context.modelName, context.modelId, context.methodNames, role);

    if (context.modelName == 'post') {
      context.model.findById(context.modelId, function(err, post) {
        if (err || !post) return reject();

        app.models.Person.findById(userId, function(err, user) {
          if (err || !user) return cb(err);

          if (post.serviceId == user.serviceId) {
            return cb(null, true);
          } else {
            return reject();
          }
        });
      });
    } else if (context.modelName == 'service') {
      context.model.findById(context.modelId, function(err, service) {
        if (err || !service) return reject();

        app.models.Person.findById(userId, function(err, user) {
          if (err || !user) return cb(err);

          if (service.id == user.serviceId) {
            return cb(null, true);
          } else {
            return reject();
          }
        });
      });
    } else if (context.modelName == 'message') {
      context.model.findById(context.modelId, function(err, message) {
        if (err || !message) return reject();

        app.models.Person.findById(userId, function(err, user) {
          if (err || !user) return cb(err);

          app.models.Post.findById(message.postId, function(err, post) {
            if (err || !post) return reject();

            if (post.serviceId == user.serviceId) {
              return cb(null, true);
            } else {
              return reject();
            }
          });
        });
      });
    } else {
      console.log('ERRRRRROR con ' + context.modelName);
      reject();
    }
  });

  Role.registerResolver('SERVICE', function(role, context, cb) {
    console.log(context.modelName, context.modelId, context.methodNames, role);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    if (context.modelName !== 'service') {
      return reject();
    }

    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    var personModel = app.models.Person;
    personModel.findById(userId, function(err, user) {
      if (err || !user) {
        return reject();
      }

      if (user.accountType !== 'SERVICE') return reject();

      cb(null, context.modelId === user.serviceId);
    });
  });

  Role.registerResolver('ADMIN', function(role, context, cb) {
    console.log('--ADMIN--');
    console.log(context.modelName, context.modelId, context.methodNames, role, context.accessToken.userId);
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    if (context.modelName !== 'service') {
      return reject();
    }

    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    var personModel = app.models.Person;
    personModel.findById(userId, function(err, user) {
      if (err || !user) {
        return reject();
      }

      if (user.accountType !== 'ADMIN') return reject();

      cb(null, true);
    });
  });
};
