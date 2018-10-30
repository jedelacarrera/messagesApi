'use strict';
var app = require('../../server/server.js');

module.exports = function(Person) {
  Person.validatesInclusionOf(
    'accountType',
    {'in': ['SERVICE', 'USER', 'ADMIN']}
  );

  Person.observe('before save', function(context, next) {
    if (!context.options.accessToken) {
      return next();
    }

    if (!context.instance) {
      var err = new Error('Unauthorized');
      err.statusCode = 401;
      next(err);
    }

    console.log(context.options);
    Person.findById(context.options.accessToken.userId,
      function(err, person) {
        if (person.accountType === 'SERVICE') {
          context.instance.serviceId = person.serviceId;
          context.instance.accountType = 'USER';
        } else if (person.accountType === 'ADMIN') {
          context.instance.accountType = 'SERVICE';
        }
        next();
      });
  });

  // role assingment
  Person.observe('after save', function(context, next) {
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    Role.findOne({
      where: {name: context.instance.accountType},
    }, function(err, role) {
      if (context.isNewInstance) {
        RoleMapping.create({
          principalType: context.instance.accountType,
          principalId: context.instance.id,
          roleId: role.id,
        });
      };
      next();
    });
  });
};
