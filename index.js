var secure = require('./lib/secure.js');
var survey = require('./lib/survey.js');
var database = require('./lib/database.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var pg = require('pg');

var jsonParser = bodyParser.json();

app.set('port', (process.env.PORT || 5000));

//400 bad request
//401 unauthorized access
//497 HTTP to HTTPS

//Request Image Storage Key
app.get('/image_auth', function(req, res){
	//Check to see if connection is using SSL
	if(secure.connection(req)){
		survey.imageAuth(req, res);
	}
	else{
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

app.get('/getSurveys', function(req, res){
	//Check to see if connection is using SSL
	if(secure.connection(req)){
		survey.getSurveys(req, res);
	}
	else{
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

//Request a Survey
app.get('/download', function(req, res){
	//Check to see if connection is using SSL
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
app.post('/upload', jsonParser, function(req, res){
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
	console.log('LTEMAC started, press Ctrl-c to terminate.');
});
