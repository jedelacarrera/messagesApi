'use strict';

module.exports = function(Subscription) {
  Subscription.observe('before save', function(context, next) {
    if (context.options.accessToken) {
      Subscription.app.models.Post.findById(
        context.instance.postId,
        function(err, post) {
          var error;
          if (err || !post) {
            error = new Error('Post not found');
            error.statusCode = 400;
            return next(error);
          }

          Subscription.app.models.Person.findById(
            context.options.accessToken.userId,
            function(err, person) {
              if (err || !person) {
                error = new Error('Person not found');
                error.statusCode = 400;
                return next(error);
              }

              if (person.serviceId !== post.serviceId) {
                error = new Error('Unauthorized post');
                error.statusCode = 401;
                return next(error);
              }
              next();
            }
          );
        }
      );
    } else {
      next();
    }
  });
};
