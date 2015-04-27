var secure = require('./lib/secure.js');
var survey = require('./lib/survey.js');
var database = require('./lib/database.js');
var express = require('express');
var app = express();
var pg = require("pg")

app.set('port', (process.env.PORT || 5000));

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
//Don't!!!! use in production
app.get('/request', function(req, res){
	res.send(req.headers);
	secure.auth(req);
});

//404 - Not Found
app.use(function(req, res){
	res.type('text/plain');
	if(secure.connection(req)){
		res.status(404);
		res.send('404 - Not Found');
		var conString = process.env.DATABASE_URL;

		var client = new pg.Client(conString);
		client.connect();

		var query = client.query("select * from secret");

		query.on("row", function(row, result) {
			result.addRow(row);
		});

		query.on("end", function(result){
			console.log(JSON.stringify(result.rows, null, "   "));
			client.end();
		});

		res.send(JSON.stringify(result.rows, null, "   "))
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
