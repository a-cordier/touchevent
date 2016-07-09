var logger = require('../util/logger');

var Role = function(id, includes) {
	var self = this;
	self.id = id;
	self.includes = includes || [];
	self.filter = function(req, res, next) {
		logger.info('my id: ' + self.id);
		logger.info('my includes: ' + self.includes);
		logger.info("user role: " + req.user.role);
		logger.info("user name: " + req.user.username);
		if (!req.user)
			return res.status(401).send({
				"message": "unauthorized"
			});
		if (req.user.role !== self.id && self.includes.indexOf(req.user.role) < 0)
			return res.status(403).send({
				"mesage": "forbidden"
			});
		return next();
	};
}

var Roles = {
	admin: new Role("admin", ["member"]),
	member: new Role("member")
};

logger.info(JSON.stringify(Roles.admin));

module.exports = Roles;