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
- subscriptions: GET /api/people/{id}/subscriptions
- create subscription: POST /api/people/{id}/subscriptions
- delete subscription: DELETE /api/people/{id}/subscriptions/{subsId}

### Service
- get users: GET /api/services/{id}/people
- create a new user: POST /api/services/{id}/people

- get posts: GET /api/services/{id}/posts
- create a new post: POST /api/services/{id}/posts/
- get a single post: GET /api/posts/{postId}

- get messages from a post: GET /api/posts/{postId}/messages
- create a new message: POST /api/posts/{postId}/messages
- get a single message: GET /api/messages/{messageId}

- get response for a message: GET /api/messages/{messageId}/responses
- create a new response: POST /api/messages/{messageId}/responses

### Search
- Search hashtag: GET /api/services/{id}/filterPosts/filterString
- Search hashtag: GET /api/services/{id}/filterMessages/filterString
