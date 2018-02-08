const express = require('express'),
    apiRouter = express.Router(),
    jwt = require('jsonwebtoken');

const secret = require('../config').secret;
    
apiRouter.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-acces-token'];

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



module.exports = apiRouter;