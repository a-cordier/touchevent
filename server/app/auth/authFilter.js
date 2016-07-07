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
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  logger.info('token: ' + token); 
  return token;
};

opts.secretOrKey = cfg.secret;
//opts.audience = "touchevent.net";

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({
    username: jwt_payload.username
  }, function(err, user) {
    if (err) {
      logger.info(err);
      return done(err, false);
    }
    if (user) {
      logger.info(user);
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));

var Filter = function(req, res, next) {
  passport.authenticate('jwt', {
    session: false
  }, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      var payload = {}
      logger.info("filter: " + req.params);
      if (req.params && req.params.resource) {
        payload.resource = req.params.resource
      }
      payload.message = 'authentication failure'
      return res.status(401).send(payload);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
    });
  })(req, res, next);
}

module.exports = Filter;