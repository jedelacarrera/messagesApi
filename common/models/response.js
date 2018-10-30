'use strict';

module.exports = function(Response) {
  Response.observe('before save', function(context, next) {
  	if (context.options.accessToken) {
    	context.instance.personId = context.options.accessToken.userId;
  	}
    next();
  });
};
