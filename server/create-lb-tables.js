var server = require('./server');
var ds = server.dataSources.postgres;
var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'post',
  'message', 'response', 'subscription', 'person'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});

