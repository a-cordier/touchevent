var logger = require('../util/logger');

function Role(id, ext) {
	this.id = id;
	this.ext = ext || [];
	this.filter = this.filter.bind(this);
}

Role.prototype.filter = function(req, res, next) {
	if (!req.user)
		return res.status(401).send({
			"message": "unauthorized"
		});
	if (req.user.role !== this.id && this.ext.indexOf(req.user.role) < 0)
		return res.status(403).send({
			"mesage": "forbidden"
		});
	return next();
};

var Roles = {
	admin: new Role("admin"),
	member: new Role("member", ["admin"]) // admin extends member
};

module.exports = Roles;