'use strict';

module.exports = function(Message) {
  Message.filterByString = function(filterString, cb) {
    Message.find(
      {where: {description: {like: `%${filterString}%`}}},
      function(err, data) {
        return cb(err, data);
      });
  };

  Message.remoteMethod(
    'filterByString',
    {
      accepts: {arg: 'filterString', type: 'string', required: true},
      http: {path: '/filter/:filterString', verb: 'get'},
      returns: {arg: 'data', type: 'string', root: true},
      description: [
        'Find messages which include a string',
        'Useful to filter messages with a hastag',
      ],
    });
};
