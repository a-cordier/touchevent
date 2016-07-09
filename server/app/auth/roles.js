var filter = function(role, req, res) {
	if (!req.user)
		return res.status(401).send({"message":"unauthorized"});
	if (req.user.role !== role.id && role.includes.indexOf(req.user.role)<0)
		return res.status(403).send({"mesage": "forbidden"});
	return next();
};


var Roles = {
	admin: {
		id: "admin",
		includes: ["member"],
		filter: function(req, res, next) {
			logger.info(JSON.stringify(this));
			return filter(this, req, res, next);
		}
	},
	member: {
		id: "member",
		includes: [],
		filter: function(req, res, next) {
			return filter(this, req, res, next);
		}
	}
};

module.exports = Roles;