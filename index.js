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
	if(secure.connection(req)){
		survey.download(req, res);
		console.log(req.param('park'));
		console.log(req.param('protocol'));
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

/* **********temporary connection test ****************/
var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})
/* **************end of temporary connection test**************/

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
