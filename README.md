# Messages Api

## Modify content

- Clone this respository
``` 
git clone https://github.com/jedelacarrera/messagesApi.git
cd messagesApi
```

- Create a file called .env
``` 
touch .env
```

- Create a postgres database
- Copy the information in .env_template and paste it in .env
- Replace credentials with your own.


## Models

### Person (extends loopback's user model)
- register: POST /people
- login: POST /people/login
- logout: POST /people/logout
- change-password: POST /people/change-password
- get posts of a person: GET /people/{id}/posts
- create post: POST /people/{id}/posts
- get messages of a person: GET /people/{id}/messages
- create a message: POST /people/{id}/messages
- get responses of a person: GET /people/{id}/responses
- create a response: POST /people/{id}/responses
- get subscriptions of a person: GET /people/{id}/subscriptions
- create a subscription: POST /people/{id}/subscriptions

### Post
- get posts: GET /posts
- create post: POST /posts
- get post messages: GET /posts/{id}/messages
- create a message to a post: POST /posts/{id}/messages
- get post subscriptions: GET /posts/{id}/subscriptions
- create a subscriptions: POST /posts/{id}/subscriptions

### Message
- get messages: GET /messages
- create message: POST /messages
- get responses of a message: GET /messages/{id}/responses
- create a response to a message: POST /messages/{id}/responses

### Response
- get responses: GET /responses
- create response: POST /responses

### Subscription
- get subscriptions: GET /subscriptions
- create a subscription: POST /subscriptions