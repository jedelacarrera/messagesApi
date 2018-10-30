'use strict';

module.exports = async function(app) {
  var personModel = app.models.Person;
  var postModel = app.models.Post;
  var messageModel = app.models.Message;
  var responseModel = app.models.Response;
  var subscriptionModel = app.models.Subscription;
  var serviceModel = app.models.Service;

  var roleModel = app.models.Role;
  var roleMappingModel = app.models.RoleMapping;


  await personModel.destroyAll();
  await postModel.destroyAll();
  await messageModel.destroyAll();
  await responseModel.destroyAll();
  await subscriptionModel.destroyAll();
  await serviceModel.destroyAll();

  await roleModel.destroyAll();
  await roleMappingModel.destroyAll();



  try {
    var roles = await createRoles();
    console.log('> roles created');
    console.log(roles);
  } catch (err) {
    console.log('> error with roles');
    console.log(err);
  }

  try {
    var service = await serviceModel.create(
      {
        'name': 'service-1',
      },
    );

    console.log(service);

    var service2 = await serviceModel.create(
      {
        'name': 'service-2',
      },
    );

    var person_admin = await personModel.create(
      {
        'email': 'admin@admin.cl',
        'username': 'admin',
        'password': '1234',
        'emailVerified': true,
        'accountType': 'ADMIN',
      }
    );

    var person_service = await personModel.create(
      {
        'email': 'a@a.cl',
        'username': 'a',
        'password': '1234',
        'emailVerified': true,
        'accountType': 'SERVICE',
        'serviceId': service.id
      }
    );

    var person_service2 = await personModel.create(
      {
        'email': 'a2@a.cl',
        'username': 'a2',
        'password': '1234',
        'emailVerified': true,
        'accountType': 'SERVICE',
        'serviceId': service2.id
      }
    );

    var people_user = await personModel.create([
      {
        'email': 'b@b.cl',
        'username': 'b',
        'password': '1234',
        'emailVerified': true,
        'accountType': 'USER',
        'serviceId': service.id
      },
      {
        'email': 'c@c.cl',
        'username': 'c',
        'password': '1234',
        'emailVerified': true,
        'accountType': 'USER',
        'serviceId': service.id
      }
    ]);

    console.log(people_user);

    var posts = await postModel.create([
     {
       "title": "post 1",
       "description": "first post",
       "personId": people_user[0].id,
       "serviceId": service.id
     },
     {
       "title": "post 2",
       "description": "second post",
       "personId": people_user[0].id,
       "serviceId": service.id
     },
     {
       "title": "post 3",
       "description": "third post",
       "personId": people_user[1].id,
       "serviceId": service.id
     },
     {
       "title": "post 4",
       "description": "fourth post",
       "personId": people_user[1].id,
       "serviceId": service.id
     }
    ]);

    console.log(posts);

    var messages = await messageModel.create([
     {
       "description": "first message",
       "postId": posts[0].id,
       "personId": people_user[0].id,
       "serviceId": service.id
     },
     {
       "description": "second message",
       "postId": posts[1].id,
       "personId": people_user[1].id,
     },
     {
       "description": "third message",
       "postId": posts[1].id,
       "personId": people_user[1].id,
     },
     {
       "description": "fourth message",
       "postId": posts[2].id,
       "personId": people_user[0].id,
     },
    ]);

    console.log(messages);

    var responses = await responseModel.create([
     {
       "description": "first response",
       "messageId": messages[0].id,
       "personId": people_user[0].id,
       "serviceId": service.id
     },
     {
       "description": "second response",
       "messageId": messages[1].id,
       "personId": people_user[1].id,
     },
     {
       "description": "third response",
       "messageId": messages[1].id,
       "personId": people_user[1].id,
     },
     {
       "description": "fourth response",
       "messageId": messages[2].id,
       "personId": people_user[0].id,
     },
    ]);

    console.log(responses);

    var subscriptions = await subscriptionModel.create([
     {
       "notification": false,
       "postId": posts[0].id,
       "personId": people_user[1].id,
       "serviceId": service.id,
     },
     {
       "notification": true,
       "postId": posts[1].id,
       "personId": people_user[1].id,
       "serviceId": service.id,
     },
     {
       "notification": false,
       "postId": posts[1].id,
       "personId": people_user[0].id,
       "serviceId": service.id,
     },
    ]);

    console.log(subscriptions);
  } catch (err) {
    console.log("errpr");
    console.log(err);
  }

  async function createRoles(err) {
      var roles = await roleModel.create([
        {
          name: 'SERVICE',
        },
        {
          name: 'USER',
        },
        {
          name: 'ADMIN',
        }
      ]);
      console.log('Roles created');
      return roles;
    }
};
