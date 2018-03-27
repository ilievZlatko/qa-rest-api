# qa-rest-api
A simple express api for Create, Read, Update and Delete questions and answers.

#### Install dependencies
```
  npm install or yarn install
```

#### Run the project
```
  yarn start or npm start
```

#### Routes
```
  GET    http://localhost:3000/questions - returns all questions
  POST   http://localhost:3000/questions - creates new question
    params: text: String
  
  DELETE http://localhost:3000/questions/:id - deletes the question
  GET    http://localhost:3000/questions/:id - returns signle question by it's _id
  POST   http://localhost:3000/questions/:id/answers - add new answer to the question
    params: text: String

  GET    http://localhost:3000/questions/:id/answers/:id - returns the answer by _id
  PUT    http://localhost:3000/questions/:id/answers/:id - updates the answer
    params: text: String

  DELETE http://localhost:3000/questions/:id/answers/:id - deletes an answer
  POST   http://localhost:3000/questions/:id/answers/:id/vote-up - votes up for an answer
  POST   http://localhost:3000/questions/:id/answers/:id/vote-down - votes down for an answer
```
