var http = require('http');
var https = require('https');
var colors = require('colors');

//Test for http to https error
function httpToHttps(){
	var testName = 'HTTP to HTTPS';
	var description = 'client trying to use an HTTP connection on a HTTPS server';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 80,
		path: '/',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = http.request(options, function(res){
		res.setEncoding('utf8');
		if(res.statusCode === 497){
			console.log(colors.green(testName + ': ') + description);
		}
		else{
			console.log(colors.red(testName + ': ') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	
	req.end();
}

//Test for https missing secret
function missingSecret(){
	var testName = 'Missing Secret';
	var description = 'clinet missing secret should be rejected';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/',
		method: 'GET'
	};
	
	var req = https.request(options, function(res){
		
		if(res.statusCode === 400){
			console.log(colors.green(testName + ': ') + description);
		}
		else{
			console.log(colors.red(testName + ': ') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//No route
function noRoute(){
	var testName = 'No Route';
	var description = 'client is pointed at non existent route';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 404){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Short secret
function shortSecret(){
	var testName = 'Short Secret';
	var description = 'client sends a secret that is to short';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/',
		method: 'GET',
		headers: {secret: '12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 400){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Secret does not exist in database
function badSecret(){
	var testName = 'Bad Secret';
	var description = 'client\'s secret does not exist in database';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-55555'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 401){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Image Auth
function imageAuth(){
	var testName = 'Img Auth';
	var description = 'client is getting the image auth secret';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/image_auth',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 200){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Download test - Missing parameters
function downloadMissParam(){
	var testName = 'Download - Missing parameters';
	var description = 'The client is attempting to download without parameters';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/download',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 400){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Download test - Doesn't exist in database
function downloadBadSurvey(){
	var testName = 'No Route';
	var description = 'client is pointed at non existent route';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 404){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Download test - Missing protocol
function downloadMissProtocol(){
	var testName = 'Download - Missing protocol';
	var description = 'The client is attempting to download without specifying a protocol';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/download?park=testSite',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 400){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Download test - Missing park
function downloadMissPark(){
	var testName = 'No Route';
	var description = 'client is pointed at non existent route';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 404){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}

//Get Surveys
function getSurveys(){
	var testName = 'No Route';
	var description = 'client is pointed at non existent route';
	
	var options = {
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/',
		method: 'GET',
		headers: {secret: '12345-12345-12345-12345-12345'}
	};
	
	var req = https.request(options, function(res){
		if(res.statusCode === 404){
			console.log(colors.green(testName + ':') + description);
		}
		else{
			console.log(colors.red(testName + ':') + description);
			console.log(colors.blue('Status Code: ') + colors.white(res.statusCode));
		}
	});
	
	
	req.on('error', function(e){
		console.error(e);
	});
	
	req.end();
}


httpToHttps();
missingSecret();
shortSecret();
badSecret();
noRoute();
imageAuth();
downloadMissParam();
downloadMissProtocol();