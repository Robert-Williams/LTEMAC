var secure = require('./lib/secure.js');
var survey = require('./lib/survey.js');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//400 bad request
//401 unauthorized access
//497 HTTP to HTTPS

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
	//Check to see if connection is using SSL
	if(secure.connection(req)){
		var authLevel = secure.auth(req);

		//Check if user is authorized to download surveys
		if(authLevel > 0){
			var park = req.query.park;
			var protocol = req.query.protocol;

			//Check if query has parameters
			if(park !== undefined && protocol !== undefined){
				var survey = survey.download(park, protocol);

				//If a result is returned, send it to the client
				if(survey.result === 'good'){
					res.json(survey.content);
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

//Show request data
<<<<<<< HEAD

/* **********temporary connection test ****************/
var pg = require('pg');

app.get('/db', function(request, response) {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test_table', function(err, result) {
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

=======
>>>>>>> 2009598fdd70f0a2dac57daa4a814042c45bce06
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
