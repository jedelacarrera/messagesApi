'use strict';

module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('SERVICE', function(role, context, cb) {
    console.log(context);
    console.log(role);
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

  Role.registerResolver('USER', function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }
    var userId = context.accessToken.userId;
    if (!userId) return reject();
    if (context.modelName !== 'service') return reject();

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
  });
};
