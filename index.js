var secure = require('./lib/secure.js');
var survey = require('./lib/survey.js');
var database = require('./lib/database.js');
var express = require('express');
var bodyParser = require('body-parser');
var color = require('colors');
var app = express();

var jsonParser = bodyParser.json();

app.set('port', (process.env.PORT || 5000));

//400 bad request
//401 unauthorized access
//497 HTTP to HTTPS

//Request Image Storage Key
app.get('/image_auth', function(req, res){
	//Check to see if connection is using SSL
	if(secure.connection(req)){
		//Check to see if user is authorized
		var authLevel = secure.auth(req);
		if(authLevel > 0){
			//Send media secret
			res.send(secure.mediaSecret());
		}
		else{
			res.type('text/plain');
			res.status(401);
			res.send('401 - Unauthorized Access');
		}
	}
	else{
		console.log(color.red('497 - HTTP to HTTPS'));
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

//Request a Survey
app.get('/download', function(req, res){
	//Check to see if connection is using SSL
	if(secure.connection(req)){
		var authLevel = secure.auth(req);

		//Check if user is authorized to download surveys
		if(authLevel > 0){
			var park = req.query.park;
			var protocol = req.query.protocol;

			//Check if query has parameters
			if(park !== undefined && protocol !== undefined){
				var result = survey.download(park, protocol);

				//If a result is returned, send it to the client
				if(result.status === 'good'){
					res.json(result.content);
				}
				else{
					res.type('text/plain');
					res.status(404);
					res.send('400 - Not Found');
				}
			}
			else{
				res.type('text/plain');
				res.status(400);
				res.send('400 - Bad Request');
			}
		}
		else{
			res.type('text/plain');
			res.status(401);
			res.send('401 - Unauthorized Access');
		}
	}
	else{
		console.log(color.red('497 - HTTP to HTTPS'));
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

//Upload a Survey
app.post('/upload', function(req, res){
	if(secure.connection(req)){
		//Check if user is authorized
		var authLevel = secure.auth(req);
		if(authLevel > 0){
			var result = survey.upload(authLevel, survey, res);
		}
		else{
			res.type('text/plain');
			res.status(401);
			res.send('401 - Unauthorized Access');
		}
	}
	else{
		console.log(color.red('497 - HTTP to HTTPS'));
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
});

/* **********temporary connection test ****************/
var pg = require('pg');

app.get('/db', function(request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM secret', function(err, result) {
			done();
			if (err) {
				console.error(err); response.send('Error ' + err);
			}
			else {
				response.send(result.rows);
			}
		});
	});
});
/* **************end of temporary connection test**************/

//Show request data
app.get('/request', function(req, res){
	res.send(req.headers);
	console.log(req.query.park);
	console.log(req.query.protocol);
	secure.auth(req);
});

//404 - Not Found
app.use(function(req, res){
	res.type('text/plain');
	if(secure.connection(req)){
		res.status(404);
		res.send('404 - Not Found');
	}
	else{
		console.log(color.red('497 - HTTP to HTTPS'));
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
