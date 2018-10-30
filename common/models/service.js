'use strict';

module.exports = function(Service) {
  Service.filterMessagesByString = function(id, filterString, cb) {
    Service.app.models.Message.find(
      {where: {description: {like: `%${filterString}%`}}},
      function(err, data) {
        if (err) cb(err);
        return cb(err, data.filter(async function(message) {
          return await Service.app.models.Post.findOne(
            {where: {id: message.postId}},
            function(err, post) {
              if (err) return false;
              return post.serviceId !== id;
            }
          );
        }));
      }
    );
  };

  Service.remoteMethod(
    'filterMessagesByString',
    {
      accepts: [
        {arg: 'id', type: 'number', required: true},
        {arg: 'filterString', type: 'string', required: true},
      ],
      http: {path: '/:id/filterMessages/:filterString', verb: 'get'},
      returns: {arg: 'data', type: 'string', root: true},
      description: [
        'Find messages which include a string',
        'Useful to filter messages with a hastag',
      ],
    }
  );

  Service.filterPostsByString = function(id, filterString, cb) {
    Service.app.models.Post.find(
      {
        where:
        {
          or: [
            {description: {like: `%${filterString}%`}},
            {title: {like: `%${filterString}%`}},
          ],
        },
      },
      function(err, data) {
        return cb(err, data);
      }
    );
  };

  Service.remoteMethod(
    'filterPostsByString',
    {
      accepts: [
        {arg: 'id', type: 'string', required: true},
        {arg: 'filterString', type: 'string', required: true},
      ],
      http: {path: '/:id/filterPosts/:filterString', verb: 'get'},
      returns: {arg: 'data', type: 'string', root: true},
      description: [
        'Find posts which include a string in the title or description',
        'Useful to filter posts with a hastag or label',
      ],
    }
  );
};
