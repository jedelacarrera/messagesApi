'use strict';
var app = require('../../server/server.js');

module.exports = function(Person) {
  // Hide methods
  Person.disableRemoteMethodByName('patchOrCreate');
  Person.disableRemoteMethodByName('replaceOrCreate');
  Person.disableRemoteMethodByName('prototype.__create__accessTokens');
  Person.disableRemoteMethodByName('prototype.__get__accessTokens');
  Person.disableRemoteMethodByName('prototype.__delete__accessTokens');
  Person.disableRemoteMethodByName('prototype.__findById__accessTokens');
  Person.disableRemoteMethodByName('prototype.__updateById__accessTokens');
  Person.disableRemoteMethodByName('prototype.__destroyById__accessTokens');
  Person.disableRemoteMethodByName('prototype.__count__accessTokens');
  Person.disableRemoteMethodByName('exists');
  Person.disableRemoteMethodByName('count');
  Person.disableRemoteMethodByName('findOne');
  Person.disableRemoteMethodByName('replaceById');
  Person.disableRemoteMethodByName('prototype.verify');
  Person.disableRemoteMethodByName('resetPassword');
  Person.disableRemoteMethodByName('setPassword');
  Person.disableRemoteMethodByName('updateAll');
  Person.disableRemoteMethodByName('upsertWithWhere');
  Person.disableRemoteMethodByName('createChangeStream');
  Person.disableRemoteMethodByName('confirm');
  Person.disableRemoteMethodByName('prototype.__get__messages');
  Person.disableRemoteMethodByName('prototype.__create__messages');
  Person.disableRemoteMethodByName('prototype.__delete__messages');
  Person.disableRemoteMethodByName('prototype.__findById__messages');
  Person.disableRemoteMethodByName('prototype.__updateById__messages');
  Person.disableRemoteMethodByName('prototype.__destroyById__messages');
  Person.disableRemoteMethodByName('prototype.__count__messages');
  Person.disableRemoteMethodByName('prototype.__get__posts');
  Person.disableRemoteMethodByName('prototype.__create__posts');
  Person.disableRemoteMethodByName('prototype.__delete__posts');
  Person.disableRemoteMethodByName('prototype.__findById__posts');
  Person.disableRemoteMethodByName('prototype.__updateById__posts');
  Person.disableRemoteMethodByName('prototype.__destroyById__posts');
  Person.disableRemoteMethodByName('prototype.__count__posts');
  Person.disableRemoteMethodByName('prototype.__get__responses');
  Person.disableRemoteMethodByName('prototype.__create__responses');
  Person.disableRemoteMethodByName('prototype.__delete__responses');
  Person.disableRemoteMethodByName('prototype.__findById__responses');
  Person.disableRemoteMethodByName('prototype.__updateById__responses');
  Person.disableRemoteMethodByName('prototype.__destroyById__responses');
  Person.disableRemoteMethodByName('prototype.__count__responses');
  Person.disableRemoteMethodByName('prototype.__get__subscriptions');
  Person.disableRemoteMethodByName('prototype.__create__subscriptions');
  Person.disableRemoteMethodByName('prototype.__delete__subscriptions');
  Person.disableRemoteMethodByName('prototype.__findById__subscriptions');
  Person.disableRemoteMethodByName('prototype.__updateById__subscriptions');
  Person.disableRemoteMethodByName('prototype.__destroyById__subscriptions');
  Person.disableRemoteMethodByName('prototype.__count__subscriptions');
  Person.disableRemoteMethodByName('prototype.__get__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__create__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__delete__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__findById__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__updateById__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__destroyById__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__count__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__exists__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__link__subscribed_posts');
  Person.disableRemoteMethodByName('prototype.__unlink__subscribed_posts');

  // role assingment
  Person.observe('after save', function(context, next) {
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    Role.findOne({
      where: {name: context.instance.accountType},
    }, function(err, role) {
      if (context.isNewInstance) {
        RoleMapping.create({
          principalType: RoleMapping.USER,
          principalId: context.instance.id,
          roleId: role.id,
        });
      };
      next();
    });
  })
};
