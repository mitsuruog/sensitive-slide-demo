var sio = require('socket.io');

exports.init = function init(server) {

	io = sio.listen(server);
	//iPadだとwebsocketだめっぽい？？
	_configure();
	return io;

};

exports.start = function start() {

	io.on('connection', function (socket) {

		socket.on('motion', function (data) {
			//console.log(data);
			io.sockets.emit('motion', data);
		});

		socket.on('orient data', function (data) {
			//console.log(data);

			io.sockets.emit('orient data', data);
		});

	});

};

_configure = function configure() {

	io.configure('production', function () {

		io.enable('browser client minification');
		io.enable('browser client etag');
		io.set('log level', 1);

		io.set('transports', [
			'websocket',
			'flashsocket',
			'htmlfile',
			'xhr-polling',
			'jsonp-polling',
		]);

	});

	io.configure('development', function () {

		io.set('log level', 1);
		io.set('transports', ['websocket']);

	});

};