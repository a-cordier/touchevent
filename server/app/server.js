var http = require('http');
var express = require('express');
var path = require('path');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var logger = require('./util/logger');
//var IoServer = require('./io/ioServer');
var timeout = require('connect-timeout');
var compression = require('compression');
var cfg = require('./cfg');
var cookieParser = require('cookie-parser');
var passport = require('passport');

/** CONFIGURE EXPRESS */
var app = express();
app.use(methodOverride());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(require('morgan')({ "stream": logger.stream }));
app.set('port', process.env.PORT || 3000);
app.use(require('./controllers'));
app.use(timeout('900s'));
app.use(compression());



/** LISTEN :: HTTP */
var server = http.createServer(app);
server.listen(app.get('port'),
	function(){
		logger.info('express is listening on ' + app.get('port'));
});
/** LISTEN :: WEBSOCKET */
require('./io/ioServer')(server);
/* LISTEN :: TWITTER STREAM */
var tStream = require('./twitter/twitterStream');
tStream.track(cfg.twitterConfig.hashtag);
