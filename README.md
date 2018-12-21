# Banking System: Backend
A small Backend project powered by Express and Mongoose.js that provides the main functions you'd expect from any banking server systems, such as signup/login a user, perform a transaction password change, balance check, and also perform transactions to different accounts.

JWTs are used for token signing/verification to maintain the authenticity of each request.

### User Schema:
```javascript
uname: String,
name: {
    firstName: String,
    middleName: String,
    lastName: String
},
debitAccount: {
    accountNumber: String,
    pin: String
},
creditAccount: {
    accountNumber: String,
    maxCredit: Number,
    balance: Number,
    interestRate: Number,
    interest: Number
},
password: String,
security: {
    question: String,
    answer: String
},
balance: {
    debit: Number,
    credit: Number
},
transactions: Array
```

### Current available request urls

**All are POST requests**

`/setup/signup` : Creates a request to signup a new user and returns a new JWT token to the client.

`/setup/login` : Creates a request to check the login credentials of a existing user and returns a new JWT token to the client for further token verification.

`/api/pinchange` : Verifies the JWT token and changes the transaction password of the user accordingly.

`/api/balance` : Returns the balance of the user.

`/api/pinchange` : Performs a transaction to the given user.

## Setup
Clone this repo to your desktop and run `npm install` to install all the dependencies.

Once the dependencies are installed, you can run `npm start` to start the application. You will then be able to access it at localhost:8090/
