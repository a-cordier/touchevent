var logger = require('../util/logger');
var cfg = require('../cfg');
var router = require('express').Router();
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var User = require('../model/user');


var opts = {};

opts.jwtFromRequest = function(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  logger.info('jwtFromRequest::token: ' + token); // shown: 'JWT <token_string>''
  return token;
};

opts.secretOrKey = cfg.secret;
//opts.audience = "touchevent.net";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  logger.info('verify::authenticating request using jwtStrategy'); // not shown
  User.findOne({
    username: jwt_payload.username
  }, function(err, user) {
    if (err) {
      logger.info('verify::error: ' + err);
      return done(err, false);
    }
    if (user) {
      logger.info('verify::user: ' + user);
      return done(null, user);
    } else {
      logger.info('verify: user not found');
      return done(null, false);
    }
  });
}));


var Filter = function(req, res, next) {

  passport.authenticate('jwt', {
    session: false
  }, function(err, user) {
    if (err) {
      logger.error(err);
      return next(err);
    }
    if (!user) {
      var payload = {}
      logger.info("filter::user " + user); // shows false
      if (req.params && req.params.resource) {
        payload.resource = req.params.resource
      }
      payload.message = 'authentication failure'
      return res.status(401).send(payload); // 401 is sent
     } 
    // req.logIn(user, function(err) {
    //   if (err) {
    //     logger.error(err);
    //     return next(err);
    //   }
      next();
  })(req, res, next);
}

module.exports = Filter;