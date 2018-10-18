'use strict';

module.exports = function(Post) {
  Post.filterByString = function(filterString, cb) {
    Post.find(
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
      });
  };

  Post.remoteMethod(
    'filterByString',
    {
      accepts: {arg: 'filterString', type: 'string', required: true},
      http: {path: '/filter/:filterString', verb: 'get'},
      returns: {arg: 'data', type: 'string', root: true},
      description: [
        'Find posts which include a string in the title or description',
        'Useful to filter posts with a hastag or label',
      ],
    });
};
