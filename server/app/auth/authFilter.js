var jwt    = require('jsonwebtoken');
var logger = require('../util/logger');
var cfg = require('../cfg');
var express = require('express');
var router = express.Router();

var Filter = function(router){
  router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.cookies.jwt;
  // decode token
  if (token) {
    logger.info('token: ' + req.cookies.jwt);
    // verifies secret and checks exp
    jwt.verify(token, cfg.secret, function(err, decoded) {      
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        logger.info(JSON.stringify(decoded));
        logger.info(decoded.role);
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});
}

module.exports=Filter;
