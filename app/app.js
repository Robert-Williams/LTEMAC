var colors = require('colors');
var secure = require('./lib/secure.js');
var express = require('express');
var app = express();

app.set('port', 3000);

//401 unauthorized access
//497 HTTP to HTTPS

//Request Image Storage Key
app.get('/image_auth', function(req, res){
	res.send('Here\'s a secret');
});

//Request a Survey
app.get('/survey', function(req, res){
	var result = {survey: 'survey 503', code: '20'};
	res.json(result);
});

//Upload a Survey
app.post('/upload', function(req, res){
});

//404 - Not Found
app.use(function(req, res){
	res.type('text/plain');
	if(secure.connection(req)){
		res.status(404);
		res.send('404 - Not Found');
	}
	else{
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

//500 - Internal Server Error
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

//Server Starting
app.listen(app.get('port'), function(){
	console.log(colors.green('LTEMAC started, press Ctrl-c to terminate.'));
});
