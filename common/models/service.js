'use strict';

module.exports = function(Service) {
  Service.filterByString = function(id, filterString, cb) {
    Service.app.models.Message.find(
      {where: {description: {like: `%${filterString}%`}, serviceId: id}},
      function(err, data) {
        return cb(err, data);
      });
  };

  Service.filterByString = function(id, filterString, cb) {
    Service.app.models.Post.find(
      {where: {description: {like: `%${filterString}%`}, serviceId: id}},
      function(err, data) {
        return cb(err, data);
      });
  };

  Service.remoteMethod(
    'filterByString',
    {
      accepts: [
      	{arg: 'id', type: 'string', required: true},
      	{arg: 'filterString', type: 'string', required: true},
      ],
      http: {path: '/:id/messages/filter/:filterString', verb: 'get'},
      returns: {arg: 'data', type: 'string', root: true},
      description: [
        'Find messages which include a string',
        'Useful to filter messages with a hastag',
      ],
    }
  );

  Service.remoteMethod(
    'filterByString',
    {
      accepts: [
      	{arg: 'id', type: 'string', required: true},
      	{arg: 'filterString', type: 'string', required: true},
      ],
      http: {path: '/:id/posts/filter/:filterString', verb: 'get'},
      returns: {arg: 'data', type: 'string', root: true},
      description: [
        'Find messages which include a string',
        'Useful to filter messages with a hastag',
      ],
    }
  );
};
