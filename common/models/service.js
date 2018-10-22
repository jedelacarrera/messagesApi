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
  Service.disableRemoteMethodByName('createChangeStream');

};
