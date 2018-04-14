const express = require('express'),
    apiRouter = express.Router(),
    User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    Transaction = require('../models/transactions')
    app = express(),
    bcrypt = require('bcrypt');

const secret = require('../config').secret;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
    
apiRouter.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return res.json({
                    succes: false,
                    message: 'Wrong token!'
                })
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            succes: false,
            message: 'No token provided'
        })
    }
})

apiRouter.post('/pinchange', (req, res) => {
    User.findOne({ uname: req.session.uname }, function(err, user) {
        if(err) throw err;

        else {
            var passwordAlreadyExists = bcrypt.compareSync(req.body.password, user.password);
            if(!passwordAlreadyExists) {
                res.json({
                    succes: false,
                    message: "password same as previous password"
                })
            }
            var hashed = bcrypt.hashSync(req.body.password, 8);
            User.update({uname: req.session.uname}, {$set: { password: hashed }})
            res.json({
                succes: true,
                message: 'password changed'
            })
        }
    })
})

apiRouter.post('/balance', (req, res) => {
    User.findOne({ uname: req.session.uname }, function(err, user) {
        if(err) throw err

        else {
            res.json({
                debitbalance: user.balance.debit,
                creditbalance: user.balance.credit
            })
        }
    })
})

apiRouter.post('/transaction', function(req, res) {
    var transactionAmount = req.body.amount;
    User.update({'debitAccount.accountNumber': req.body.payee}, {$inc: { 'balance.debit': transactionAmount}});
    User.update({'debitAccount.accountNumber': req.body.payer}, {$inc: { 'balance.debit': -1*transactionAmount}});
    var transaction = new Transaction({
        payee: req.body.payee,
        payer: req.body.payer,
        amount: req.body.amount
    })
    transaction.save(function (err, trans) {
        if(err) {
            console.log(err);
            User.update({'debitAccount.accountNumber': req.body.payee}, {$inc: { 'balance.debit': -1*transactionAmount}});
            User.update({'debitAccount.accountNumber': req.body.payer}, {$inc: { 'balance.debit': transactionAmount}});
            res.json({
                succes: false,
                message: 'Transaction failed!'
            })
        }
        User.findOneAndUpdate({ 'debitAccount.accountNumber': req.body.payee }, { $push: { transactions: trans.id }})
        User.findOneAndUpdate({ 'debitAccount.accountNumber': req.body.payer }, { $push: { transactions: trans.id }})
        console.log('Transaction Complete!');
        res.json({
            success: true,
            message: "Transaction Successful!"
        })
    })
})

module.exports = apiRouter;