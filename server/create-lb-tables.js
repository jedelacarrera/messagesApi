var server = require('./server');

server.dataSources.postgres.on('connected', automigrate);

function automigrate() {
  var ds = server.dataSources.postgres;
  var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'post',
    'message', 'response', 'subscription', 'person', 'service'];
  ds.automigrate(lbTables, function(er) {
    if (er) throw er;
    console.log('Tables [' + lbTables + '] created in ', ds.adapter.name);
    ds.disconnect();
  });
}
