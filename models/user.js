const mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
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
    }
}))