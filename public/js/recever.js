(function () {

	var socket = io.connect();

	socket.on('motion', function (data) {
	console.log(data);

		if (data.top === true) {
			Reveal.up();
		} else if (data.down === true) {
			Reveal.down();
		} else if (data.right === true) {
			Reveal.right();
		} else if (data.left === true) {
			Reveal.left();
		} else if (data.home === true) {
			location.replace('/');
		} else if (data.init === true) {
			initMousePointer();
		}

	});

	var screen_x = document.documentElement.clientWidth;
	var screen_y = document.documentElement.clientHeight;

	var init_x = screen_x / 2 - 25;
	var init_y = screen_y / 2 - 25;
	var _pointer = $('<img/>').attr({
		src: 'image/hand.png',
		id: 'mouse-point',
		class:'mouse-point'
	});

	_pointer.css({
		top: init_y,
		left: init_x,
		width: 50,
		position: 'absolute',
		'z-index': 999,
		opacity: .5
	});

	$('.reveal').append(_pointer);

	function initMousePointer(){

		_pointer.css({
			top: init_y,
			left: init_x
		});
		pointer_top =  init_y;
		pointer_left = init_x;
	}

	var pointer_top = init_y;
	var pointer_left = init_x;

	socket.on('orient data', function (data) {
		pointer_top += data.yg * 20;
		pointer_left += data.xg * 20;

		if(pointer_top < 0) pointer_top = 0;
		if(pointer_left < 0) pointer_left = 0;
		if(pointer_top > screen_y - 50) pointer_top = screen_y - 50;
		if(pointer_left > screen_x - 50) pointer_left = screen_x - 50;

			_pointer.css({
			top: pointer_top,
			left: pointer_left
		});

		$('.acceleration')
			.find('.x').text(data.x).end()
			.find('.y').text(data.y).end()
			.find('.z').text(data.z);

		$('.inclination')
			.find('.x').text(data.xg).end()
			.find('.y').text(data.yg).end()
			.find('.z').text(data.zg);

		$('.rotation')
			.find('.x').text(data.a).end()
			.find('.y').text(data.b).end()
			.find('.z').text(data.g);

	});

})();