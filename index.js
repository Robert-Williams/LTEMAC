var secure = require('./lib/secure.js');
var survey = require('./lib/survey.js');
var express = require('express');
var bodyParser = require('body-parser');
var connectTimeout = require('connect-timeout');

var app = express();
<<<<<<< HEAD
var jsonParser = bodyParser.json();
//var timout = connectTimeout({time:5000});
=======
var timeout = connectTimeout({time:5000});
>>>>>>> 398d927e09ec8195b4ce07b8da4afdbb094eb168

app.set('port', (process.env.PORT || 5000));

// NICE: secure.connection could be a seperate route located at top that matches every other route
// if the auth is successful the route can call next() if not then respond with 401
// that's more of the express convention (IoC)

// MUST: use npm forever to prevent the NodeJS process from dying on unhandled errors, unless hiroku does this for you

//Request Image Storage Key
app.get('/image_auth', function(req, res){
	secure.connection(req, res, survey.imageAuth);
});

//Request list of surveys in interim database
<<<<<<< HEAD
app.get('/getSurveys', function(req, res){
=======
// SHOULD: name it /surveys instead of using getSurveys
app.get('/getSurveys', timeout, function(req, res){
>>>>>>> 398d927e09ec8195b4ce07b8da4afdbb094eb168
	secure.connection(req, res, survey.getSurveys);
});

//Request a Survey
<<<<<<< HEAD
app.get('/download', function(req, res){
=======
// SHOULD: name it /surveys/:id instead download
app.get('/download', timeout, function(req, res){
>>>>>>> 398d927e09ec8195b4ce07b8da4afdbb094eb168
	secure.connection(req, res, survey.download);
});

//Upload a Survey
<<<<<<< HEAD
app.post('/upload', jsonParser, function(req, res){
=======
// SHOULD: name it /surveys instead upload
app.post('/upload', timeout, function(req, res){
	secure.connection(req, res, survey.upload);
});

//Upload a Survey
// MUST: is this a duplicate of the above route?
app.post('/upload', timeout, function(req, res){
>>>>>>> 398d927e09ec8195b4ce07b8da4afdbb094eb168
	secure.connection(req, res, survey.upload);
});

//404 - Not Found
app.use(function(req, res){
	secure.connection(req, res, survey.missingPage);
});

//500 - Internal Server Error
// When does this fire?
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

//Server Starting
app.listen(app.get('port'), function(){
	console.log('LTEMAC started, press Ctrl-c to terminate.');
<<<<<<< HEAD
});
=======
});
>>>>>>> 398d927e09ec8195b4ce07b8da4afdbb094eb168
