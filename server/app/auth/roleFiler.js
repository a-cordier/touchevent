var filter = function(id, req, res, next) {
	if (!req.user)
		res.status(401).send("unauthorized");
	if (req.user.role !== id)
		res.status(403).send("forbidden");
	next();
};


var Roles = {
	admin: {
		id: "admin",
		filter: function(req, res, next) {
			filter(this.id, req, res, next);
		}
	},
	member: {
		id: "member",
		filter: function(req, res, next) {
			filter(this.id, req, res, next);
		}
	}
};

module.exports = Roles;