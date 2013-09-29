fs = require('fs');

exports.index = function(req, res){
	res.render('index');
};

exports.controller = function(req, res){
	res.render('controller');
};

exports.test = function(req, res){
	res.render('test');
};

exports.tree = function(req, res){
	res.render('tree');
};


exports.slide = function(req, res){

	var slide, slideTitle = '';

	slide = fs.readFileSync(__dirname + '/../views/slides/index.html', 'utf-8');

	res.render('template/slide', {
		slide: slide,
		slideTitle: slideTitle
	});
};
