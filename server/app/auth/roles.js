var logger = require('../util/logger');

var Role = function(id, includes) {
	this.id = id;
	this.includes = includes || [];
}

Role.prototype.filter = function(req, res, next) {
	logger.info(JSON.stringify(this.prototype));
	logger.info('id: ' + this.id);
	if (!req.user)
		return res.status(401).send({
			"message": "unauthorized"
		});
	if (req.user.role !== this.id && this.includes.indexOf(req.user.role) < 0)
		return res.status(403).send({
			"mesage": "forbidden"
		});
	return next();
}

var Roles = {
	admin: new Role("admin", ["member"]),
	member: new Role("member")
};

module.exports = Roles;