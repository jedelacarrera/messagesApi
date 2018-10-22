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

### Service
- get users: GET /services/{id}/people
- create a new user: POST /services/{id}/people
- get single user: GET /services/{id}/people/{userId}
- update user: PUT /services/{id}/people/{userId}
- delete user: DELETE /services/{id}/people/{userId}
- get posts subscribed by user: GET /services/{id}/people/{userId}/subscriptions
- subscribe an user for a post: POST /services/{id}/people/{userId}/subscriptions/posts/{postId}

- get posts: GET /services/{id}/posts
- create a new post: POST /services/{id}/posts/author/{authorId}
- get a single post: GET /services/{id}/posts/{postId}
- update post: PUT /services/{id}/posts/{postId}
- delete post: DELETE /services/{id}/posts/{postId}
- get users subscribed to post: GET /services/{id}/posts/{postId}/subscriptions

- get messages from a post: GET /services/{id}/posts/{postId}/messages
- create a new message: POST /services/{id}/posts/{postId}/messages/author/{messageId}
- get a single message: GET /services/{id}/posts/{postId}/messages/{messageId}

- get response for a message: GET /services/{id}/posts/{postId}/messages/{messageId}/responses
- create a new response: POST /services/{id}/posts/{postId}/messages/{messageId}/responses/author/{responseId}
- get a single response: GET /services/{id}/posts/{postId}/messages/{messageId}/responses/{responseId}
