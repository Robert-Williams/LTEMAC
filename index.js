var secure = require('./lib/secure.js');
var survey = require('./lib/survey.js');
var express = require('express');
var bodyParser = require('body-parser');
var connectTimeout = require('connect-timeout');

var app = express();
//var jsonParser = bodyParser.json();
//var timout = connectTimeout({time:5000});

app.set('port', (process.env.PORT || 5000));

//Request Image Storage Key
app.get('/image_auth', function(req, res){
	secure.connection(req, res, survey.imageAuth);
});

//Request list of surveys in interim database
app.get('/getSurveys', function(req, res){
	secure.connection(req, res, survey.getSurveys);
});

//Request a Survey
app.get('/download', function(req, res){
	secure.connection(req, res, survey.download);
});

//Upload a Survey
app.post('/upload', function(req, res){
	secure.connection(req, res, survey.upload);
});

//Upload a Survey
app.post('/upload', function(req, res){
	secure.connection(req, res, survey.upload);
});

//404 - Not Found
app.use(function(req, res){
	secure.connection(req, res, survey.missingPage);
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
