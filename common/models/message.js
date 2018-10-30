'use strict';

module.exports = function(Message) {
  Message.observe('before save', function(context, next) {
  	if (context.options.accessToken) {
    	context.instance.personId = context.options.accessToken.userId;
  	}
    next();
  });
};
