var logger = require('../util/logger');
var Vote = require('../model/vote');
var Qa = require('../model/qa')

/* "singleton" socket */
var io;

var Room = {
	user: 'user',
	admin: 'admin',
	speaker: 'speaker',
	screen: 'screen'
};

var IoServer = function(server) {
	if (server) {
		var socket = require('socket.io')({
			'transports': ['websocket', 'polling']//, 'polling']
		});
		io = socket.listen(server,{resource: '/socket.io/'});
		//io.set('origins', '*:*');
		io.on('connection', function(socket) {
			socket.on('join', function(room) {
				Object.keys(Room).forEach(
					function(_room) {
						if (room !== _room) {
							logger.info('leaving room', _room);
							socket.leave(_room);
							logger.info(_room, 'room leaved');
						}
					}
				);
				logger.info('joining room', room);
				socket.join(room);
			});
			socket.on('qa-deleted', function(id) {
				socket.in(Room.admin).emit('qa-deleted', id);
			});
			// socket.on('qa-validated', function(id) {
			// 	socket.in(Room.speaker).emit('qa-validated', id);
			// 	socket.in(Room.admin).emit('qa-validated', id);
			// });
			socket.on('synth-transition', function(data) {
				socket.in(Room.speaker).emit('synth-transition', data);
				socket.in(Room.screen).emit('synth-transition', data);
				socket.in(Room.admin).emit('synth-transition', data);
			});
		});
	}
	return this;
};

IoServer.pushQa = function(data) {
	if (!io)
		throw new Error("Socket.io is not initalized");
	logger.info('sending qa-received event to sockets in ', Room.admin, 'room');
	io.sockets.in(Room.admin).emit('qa:new', data);
};

IoServer.synthTransition = function(data) {
	if (!io)
		throw new Error("Socket.io is not initalized");
	logger.info('sending synth-transition event to sockets in ', Room.admin, 'room');
	io.sockets.in(Room.speaker).emit('synth-transition', data);
	io.sockets.in(Room.screen).emit('synth-transition', data);
	io.sockets.in(Room.admin).emit('synth-transition', data);
};

IoServer.validateQa = function(data) {
	if (!io)
		throw new Error("Socket.io is not initalized");
	logger.info('sending validation event to sockets in ', Room.admin, 'room');
	logger.info('sending validation event to sockets in ', Room.speaker, 'room');
	io.sockets.in(Room.speaker).emit('qa:state', data);
	io.sockets.in(Room.admin).emit('qa:state', data);
};

IoServer.deleteQa = function(data) {
	if (!io)
		throw new Error("Socket.io is not initalized");
	logger.info('sending qa deletion event to sockets in ', Room.admin, 'room');
	io.sockets.in(Room.admin).emit('qa-deleted', data);
};


IoServer.updatePollResult = function(data) {
	if (!io)
		throw new Error("Socket.io is not initalized");
	logger.info('sending poll update event to sockets in ', Room.admin, 'room');
	io.sockets.in(Room.admin).emit('poll-updated', data);
};

module.exports = IoServer;