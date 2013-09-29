(function () {
	var socket = io.connect();

	var Throttle = function Throttle(minInterval) {

		var timestamp = 0,
			exec,
			timer;

		exec = function exec(func, args) {

			var now = +new Date(),
				diff;

			diff = now - timestamp;

			if (timer) {
				// clear the timeout, if one is pending
				clearTimeout(timer);
				timer = null;
			}

			if(diff >= minInterval){
				timestamp = now;
				func.apply(null, args);
			}else{
				timer = setTimeout(function(){
					exec(func, args);
				}, minInterval - diff);
			}

		};

		return {
			exec: exec
		}
	};

	var throttle = new Throttle(100);

	function emit(eventName, data) {
		socket.emit(eventName, data);
	}

	window.addEventListener("devicemotion", function(e){

		test(e);

	});

	/**
	 *
	 * Sample
	 *
	 */
	$('#top').on('click', function (e) {
		e.preventDefault();
		emit('motion', { top: true });
	});

	$('#down').on('click', function (e) {
		e.preventDefault();
		emit('motion', { down: true });
	});

	$('#right').on('click', function (e) {
		e.preventDefault();
		emit('motion', { right: true });
	});

	$('#left').on('click', function (e) {
		e.preventDefault();
		emit('motion', { left: true });
	});

	$('#home').on('click', function (e) {
		e.preventDefault();
		emit('motion', { home: true });
	});

	$('#init').on('click', function (e) {
		e.preventDefault();
		emit('motion', { init: true });
	});

	/**
	 *
	 * for test
	 *
	 */

	var pos_x = 0;
	var pos_y = 0;
	var pos_z = 0;
	var high_x = 0;
	var high_y = 0;
	var high_z = 0;
	var pos_x30, pos_y30, pos_z30, high_x30, high_y30, high_z30 = 0;
	var pos_x10, pos_y10, pos_z10, high_x10, high_y10, high_z10 = 0;
	var pos_xg, pos_yg, pos_zg, high_xg, high_yg, high_zg = 0;
	var acc;
	var data = {};

	function test(point){

		data.x = point.acceleration.x; // X方向の加速度
		data.y = point.acceleration.y; // Y方向の加速度
		data.z = point.acceleration.z; // Z方向の加速度
		data.xg = point.accelerationIncludingGravity.x; // X方向の傾き
		data.yg = point.accelerationIncludingGravity.y; // Y方向の傾き
		data.zg = point.accelerationIncludingGravity.z; // Z方向の傾き
		data.a = point.rotationRate.alpha; // Z方向の回転値
		data.b = point.rotationRate.beta; // X方向の回転値
		data.g = point.rotationRate.gamma; // Y方向の回転値

		acc = point.accelerationIncludingGravity;
		var accel_scale = 30.0;
		var filter_val = 0.1;

		// ローパスフィルタ
		pos_x = (acc.x * filter_val) + (pos_x * (1.0 - filter_val));
		pos_y = (-acc.y * filter_val) + (pos_y * (1.0 - filter_val));
		pos_z = (acc.z * filter_val) + (pos_z * (1.0 - filter_val));

		//ハイパスフィルタ
		high_x = (acc.x * filter_val) - high_x;
		high_y = (acc.y * filter_val) - high_y;
		high_z = (acc.z * filter_val) - high_z;

		data.lx = pos_x;
		data.ly = pos_y;
		data.lz = pos_z;
		data.hx = high_x;
		data.hy = high_y;
		data.hz = high_z;

		// ローパスフィルタ*10
		pos_x10 = (acc.x * 10 * accel_scale * filter_val) + (pos_x * (1.0 - filter_val));
		pos_y10 = (-acc.y * 10 * accel_scale * filter_val) + (pos_y * (1.0 - filter_val));
		pos_z10 = (acc.z * 10 * accel_scale * filter_val) + (pos_z * (1.0 - filter_val));

		//ハイパスフィルタ*10
		high_x10 = (acc.x * 10 * accel_scale * filter_val) - high_x;
		high_y10 = (acc.y * 10 * accel_scale * filter_val) - high_y;
		high_z10 = (acc.z * 10 * accel_scale * filter_val) - high_z;

		data.lx10 = pos_x10;
		data.ly10 = pos_y10;
		data.lz10 = pos_z10;
		data.hx10 = high_x10;
		data.hy10 = high_y10;
		data.hz10 = high_z10;

		// ローパスフィルタ
		pos_x30 = (acc.x * accel_scale * filter_val) + (pos_x * (1.0 - filter_val));
		pos_y30 = (-acc.y * accel_scale * filter_val) + (pos_y * (1.0 - filter_val));
		pos_z30 = (acc.z * accel_scale * filter_val) + (pos_z * (1.0 - filter_val));

		//ハイパスフィルタ
		high_x30 = (acc.x * accel_scale * filter_val) - high_x;
		high_y30 = (acc.y * accel_scale * filter_val) - high_y;
		high_z30 = (acc.z * accel_scale * filter_val) - high_z;

		data.lx30 = pos_x30;
		data.ly30 = pos_y30;
		data.lz30 = pos_z30;
		data.hx30 = high_x30;
		data.hy30 = high_y30;
		data.hz30 = high_z30;


		$('.acceleration')
			.find('.x').text(data.x).end()
			.find('.y').text(data.y).end()
			.find('.z').text(data.z);

		$('.inclination')
			.find('.rx').text(pos_x).end()
			.find('.ry').text(pos_y).end()
			.find('.rz').text(pos_z).end()
			.find('.x').text(data.xg).end()
			.find('.y').text(data.yg).end()
			.find('.z').text(data.zg);

		$('.rotation')
			.find('.x').text(data.a).end()
			.find('.y').text(data.b).end()
			.find('.z').text(data.g);

		throttle.exec(emit, ['orient data', data]);

	}

	//6で準備して8以上で動いたと判定
	var READY_STATE = 6;
	var ACTION_STATE = 8;
	var INTERVAL = 50;
	var TIMEOUT = 500;
	var moved = '';
	var moving = false;
	var time = 0;

	setInterval(function(){

		if(!moved){
			if(data.xg > READY_STATE){
				moved = 'left';
			} else if(data.xg < -READY_STATE){
				moved = 'right';
			}
		}

		if(moved = 'left' && data.xg > ACTION_STATE && !moving){
			moving = true;
			$('#left').click();
			$('.motion').text('←');
		} else if(moved = 'right' && data.xg < -ACTION_STATE && !moving){
			moving = true;
			$('#right').click();
			$('.motion').text('→');
		}

		time += INTERVAL;
		if(time > TIMEOUT) {
			moved = '';
			moving = false;
			time = 0;
		}

	}, INTERVAL);

})();
