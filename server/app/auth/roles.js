var logger = require('../util/logger');

var Role = function(id, includes) {
	this.id = id;
	this.includes = includes || [];
	logger.info(this.id);
	logger.info(this.includes);
}

Role.prototype.filter = function(req, res, next) {
	logger.info('my id: ' + this.id);
	logger.info('my includes: ' + this.includes);
	if (!req.user)
		return res.status(401).send({
			"message": "unauthorized"
		});
	if (req.user.role !== this.id && this.includes.indexOf(req.user.role) < 0)
		return res.status(403).send({
			"mesage": "forbidden"
		});
	return next();
};

var Roles = {
	admin: new Role("admin", ["member"]),
	member: new Role("member")
};

logger.info(JSON.stringify(Roles.admin));

module.exports = Roles;