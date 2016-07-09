var logger = require('../util/logger');


var Role = function(id, ext) {
	var self = this;
	self.id = id;
	self.ext = ext || [];
	self.filter = function(req, res, next) {
		if (!req.user)
			return res.status(401).send({
				"message": "unauthorized"
			});
		if (req.user.role !== self.id && self.ext.indexOf(req.user.role) < 0)
			return res.status(403).send({
				"mesage": "forbidden"
			});
		return next();
	};
}

// function Role(id, ext) {
// 	this.id = id;
// 	this.ext = ext || [];
// }

// Role.prototype.filter = function(req, res, next) {
// 	if (!req.user)
// 		return res.status(401).send({
// 			"message": "unauthorized"
// 		});
// 	if (req.user.role !== this.id && this.ext.indexOf(req.user.role) < 0)
// 		return res.status(403).send({
// 			"mesage": "forbidden"
// 		});
// 	return next();
// };

var Roles = {
	admin: new Role("admin"),
	member: new Role("member", ["admin"]) // admin extends member
};

module.exports = Roles;