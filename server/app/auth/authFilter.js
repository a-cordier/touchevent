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
  logger.info('jwt_payload: ' + jwt_payload);
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
      logger.info('user not found');
      done(null, false);
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var Filter = function(req, res, next) {
  try {
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
        next();
      });
    })(req, res, next);
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

module.exports = Filter;