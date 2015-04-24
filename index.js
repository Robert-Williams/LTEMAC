var colors = require('colors');
var secure = require('./lib/secure.js');
var survey = require('./lib/survey.js');
var express = require('express');
var app = express();

app.set('port', 3000);

//401 unauthorized access
//497 HTTP to HTTPS

app.get('/', function(req, res){
	res.send('Welcome to zombocom!');
});

//Request Image Storage Key
app.get('/image_auth', function(req, res){
	if(secure.connection(req)){
		secure.sendSecret(req, res);
	}
	else{
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

//Request a Survey
app.get('/download', function(req, res){
	if(secure.connection(req)){
		survey.download(req, res);
	}
	else{
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

//Upload a Survey
app.post('/upload', function(req, res){
	if(secure.connection(req)){
		survey.upload(req, res);
	}
	else{
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
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
