var http = require('http');
var sockjs = require('sockjs');

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
var connections = {};

echo.on('connection', function (conn) {
	connections[conn.id] = {
		connection: conn
	};

	conn.on('data', function (msg) {
		msg = JSON.parse(msg);
		var handler = messageHandlers[msg.type];
		if (typeof handler == 'function') handler(conn, msg.data);
	});

	conn.on('close', function () {
		broadcast('disconnect', {}, conn.id);
		delete connections[conn.id];
	});
});

var server = http.createServer();
echo.installHandlers(server, { prefix: '/echo' });
server.listen(9999, '0.0.0.0');

var messageHandlers = {
	connect: function (conn, data) {
		if (Object.keys(connections).some(function(id) {
			return connections[id].username == data.username;
		})) {
			sendTo(conn.id, 'connectionError', {
				message: 'Username ' + data.username + ' is already in use!'
			});
		} else if (Object.keys(connections).some(function(id) {
			return connections[id].email == data.email;
		})) {
			sendTo(conn.id, 'connectionError', {
				message: 'Email ' + data.email + ' is already in use!'
			});
		} else {
			connections[conn.id].username = data.username;
			connections[conn.id].email = data.email;

			sendTo(conn.id, 'connected', {});
			broadcast('connect', data, conn.id);
		}
	},
	message: function (conn, data) {
		data.username = connections[conn.id].username;
		data.mail = connections[conn.id].mail;
		broadcast('message', data, conn.id);
	},
	list: function (conn, data) {
		var users = [];
		Object.keys(connections).forEach(function(id) {
			if (connections[id].email) {
				users.push({
					id: id,
					username: connections[id].username,
					email: connections[id].email
				});
			}
		});

		sendTo(conn.id, 'list', users);
	}
};

function broadcast (type, data, originator) {
	Object.keys(connections).forEach(function(id) {
		sendTo(id, type, data, originator);
	});
}
function sendTo (connectionId, type, data, originator) {
	if (typeof originator == 'undefined') originator = connectionId;

	connections[connectionId].connection.write(JSON.stringify({
		type: type,
		originator: originator,
		data: data
	}));
}