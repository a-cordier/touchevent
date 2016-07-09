var logger = require('../util/logger');

// var Role = function(id, includes) {
// 	var self = this;
// 	self.id = id;
// 	self.includes = includes || [];
// 	self.filter = function(req, res, next) {
// 		if (!req.user)
// 			return res.status(401).send({
// 				"message": "unauthorized"
// 			});
// 		if (req.user.role !== self.id && self.includes.indexOf(req.user.role) < 0)
// 			return res.status(403).send({
// 				"mesage": "forbidden"
// 			});
// 		return next();
// 	};
// }

var Role = function(id, includes) {
	this.id = id;
	this.includes = includes || [];
}

Role.prototype.filter = function(req, res, next) {
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
	admin: new Role("admin"),
	member: new Role("member", ["admin"]) // admin extends member
};

module.exports = Roles;