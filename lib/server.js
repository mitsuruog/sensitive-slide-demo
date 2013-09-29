/**
 * Module dependencies.
 */

var express = require('express'),
	ejs = require('ejs'),
	routes = require('../routes'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	handlebars = require('handlebars'),
	engines = require('consolidate');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

//handlebars template
app.set('views', __dirname + '/../views/');
app.set('view engine', 'handlebars');
app.set("view options", { layout: false });
app.engine('handlebars', engines.handlebars);


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

//static files dir
app.use(express.static(path.join(__dirname, '/../public')));

//TODO reveal.js module publish here!!
//ex)app.use('/reveal.js/js', express.static(path.join(__dirname, '/../node_module/reveal.js/...')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//routing
app.get('/', routes.index);
app.get('/c', routes.controller);
app.get('/t', routes.test);
app.get('/tree', routes.tree);
app.get('/slide', routes.slide);

var server = http.createServer(app).listen(app.get('port'), process.env.IP, function () {
	console.log('Express server listening on port ' + app.get('port'));
});

//socket.io
var socket = require('./socket');

app.set('io', socket.init(server));
socket.start();