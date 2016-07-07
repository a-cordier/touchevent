var jwt = require('jsonwebtoken');
var logger = require('../util/logger');
var cfg = require('../cfg');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var User = require('../model/user');


var opts = {}

opts.jwtFromRequest = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies.jwt;
    }
    return token;
};

opts.secretOrKey = cfg.secret;
opts.audience = "touchevent.net";

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({
    username: jwt_payload.username
  }, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));

var Filter = function(req, res, next, callback) {
  passport.authenticate('jwt', {
    session: false
  }, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      var payload = {}
      if (req.body.resource) {
        payload.resource = req.body.resource
      }
      payload.message = 'authentication failure'
      return res.status(401).send(payload);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      logger.info('req.body.user.username: ' + req.body.user.username);
      logger.info('user.username: ' + user.username);
      callback(req, res);
    });
  })(req, res, next);
}

// var Filter = function(router) {
//   router.use(function(req, res, next) {

//     // check header or url parameters or post parameters for token
//     var token = req.cookies.jwt;
//     // decode token
//     if (token) {
//       logger.info('token: ' + req.cookies.jwt);
//       // verifies secret and checks exp
//       jwt.verify(token, cfg.secret, function(err, decoded) {
//         if (err) {
//           return res.status(401).json({
//             success: false,
//             message: 'Failed to authenticate token.'
//           });
//         } else {
//           // if everything is good, save to request for use in other routes
//           req.decoded = decoded;
//           logger.info(JSON.stringify(decoded));
//           logger.info(decoded.role);
//           next();
//         }
//       });

//     } else {

//       // if there is no token
//       // return an error
//       return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//       });

//     }
//   });
// }

module.exports = Filter;