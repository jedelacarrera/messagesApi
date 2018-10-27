module.exports = function(app) {
  var Role = app.models.Role;

  Role.registerResolver('S', function(role, context, cb) {
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

      cb(null, context.modelId === user.serviceId);
    });

  });

};
