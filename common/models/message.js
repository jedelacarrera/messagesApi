'use strict';

module.exports = function(Message) {
  Message.observe('before save', function(context, next) {
    if (context.options.accessToken) {
      context.instance.personId = context.options.accessToken.userId;
    }
    next();
  });

  Message.observe('after save', function(context, next) {
    var postId = context.instance.postId;
    Message.app.models.Subscription.updateAll(
      {
        postId: context.instance.postId,
        notification: false,
      },
      {
        notification: true,
      },
      function(err) {
        if (err) console.log(err);
        next();
      }
    );
  });
};
