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
- Install dependencies
``` 
npm install
```
- Run
``` 
node .
```

## Models

### Person (extends loopback's user model)
- register: POST /api/people
- login: POST /api/people/login
- logout: POST /api/people/logout
- change-password: POST /api/people/change-password
- get posts of a person: GET /api/people/{id}/posts
- create post: POST /api/people/{id}/posts
- get messages of a person: GET /api/people/{id}/messages
- create a message: POST /api/people/{id}/messages
- get responses of a person: GET /api/people/{id}/responses
- create a response: POST /api/people/{id}/responses
- get subscriptions of a person: GET /api/people/{id}/subscriptions
- create a subscription: POST /api/people/{id}/subscriptions
- delete a subscription: DELETE /api/people/{personId}/subscriptions/{subscriptionId}

### Post
- get posts: GET /api/posts
- get post messages: GET /api/posts/{id}/messages
- get post subscriptions: GET /api/posts/{id}/subscriptions
- get post with include a hashtag (or any string) in the title or description: GET /api/posts/filter/{hashtag}

### Message
- get messages: GET /api/messages
- get responses of a message: GET /api/messages/{id}/responses
- get messages with include a hashtag (or any string): GET /api/messages/filter/{hashtag}

### Response
- get responses: GET /api/responses

### Subscription
- get subscriptions: GET /api/subscriptions