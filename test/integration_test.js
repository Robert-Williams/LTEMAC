var http = require('http');
var https = require('https');
var colors = require('colors');


/* *****************************************************************
	Test GET/REQUEST from image_auth in HTTP for secret header
	
	reference: https://nodejs.org/api/https.html
*******************************************************************/

var image_auth_options = {
	hostname: 'capstone-ltemac.herokuapp.com',
	port: 443,
	path: '/image_auth',
	method: 'GET',
	header: {'secret': '12345-12345-12345-12345-12345'}
};
//set Agent object

image_auth_options.agent = new http.Agent(image_auth_options);

var image_auth_req = http.request(image_auth_options, function(res) {
	console.log('\n\n****GET request HTTP function for image_auth*****'.yellow);
	console.log('statusCode: '.cyan + res.statusCode);
	console.log('headers:'.red);
	for (var item in res.headers){
		console.log('\t' + item.cyan +  ': ' + res.headers[item]);
	}

	res.on('data', function(d) {
		colors.red(process.stdout.write(d));
  });
});
image_auth_req.end();
image_auth_req.on('error', function(e) {
	
	//console.log('error occurred in HTTP image_auth GET request'.red);
	console.error('error occurred in HTTP image_auth GET request,\n\tmessage: '.red + e.message);
});

/* *****************************************************************
	Test GET/REQUEST from image_auth in HTTPS for secret header
*******************************************************************/

var image_auth_options = {
	hostname: 'capstone-ltemac.herokuapp.com',
	port: 443,
	path: '/image_auth',
	method: 'GET',
	header: {'secret': '12345-12345-12345-12345-12345'}
};
//set Agent object

image_auth_options.agent = new https.Agent(image_auth_options);

var image_auth_req = https.request(image_auth_options, function(res) {
	console.log('\n\n****GET request HTTPS function for image_auth*****'.yellow);
	console.log('statusCode: '.cyan + res.statusCode);
	console.log('headers:'.red);
	for (var item in res.headers){
		console.log('\t' + item.cyan +  ': ' + res.headers[item]);
	}

	res.on('data', function(d) {
		colors.red(process.stdout.write(d));
  });
});
image_auth_req.end();
image_auth_req.on('error', function(e) {
	console.log('error occurred in HTTPS image_auth GET request'.red);
	console.error(e);
});



/* *****************************************************************
	Test GET/REQUEST from DOWNLOAD in HTTP function for secret header
*******************************************************************/

var download_options = {
	hostname: 'capstone-ltemac.herokuapp.com',
	port: 443,
	path: '/download',
	method: 'GET',
	header: {'secret': '12345-12345-12345-12345-12345'}
};
//set Agent object

download_options.agent = new http.Agent(download_options);

var download_req = http.request(download_options, function(res) {
	console.log('\n\n****GET request http function for download*****'.underline.yellow);
	console.log('statusCode: '.cyan + res.statusCode);
	console.log('headers:'.red);
	for (var item in res.headers){
		console.log('\t' + item.cyan +  ': ' + res.headers[item]);
	}

	res.on('data', function(d) {
		process.stdout.write(d);
  });
});
download_req.end();
download_req.on('error', function(e) {
	
	//console.log('error occurred in HTTP download GET request, message: '.red + e.message);
	console.error('error occurred in HTTP download GET request,\n\tmessage: '.red + e.message);
});

/* *****************************************************************
	Test GET/REQUEST from DOWNLOAD in HTTPS function for secret header
*******************************************************************/

var download_options = {
	hostname: 'capstone-ltemac.herokuapp.com',
	port: 443,
	path: '/download?park=testSite&protocol=testProtocol',
	method: 'GET',
	header: {'secret': '12345-12345-12345-12345-12345'}
};
//set Agent object

download_options.agent = new https.Agent(download_options);

var download_req = https.request(download_options, function(res) {
	console.log('\n\n****GET request https function for download*****'.underline.yellow);
	console.log('statusCode: '.cyan + res.statusCode);
	console.log('headers:'.red);
	for (var item in res.headers){
		console.log('\t' + item.cyan +  ': ' + res.headers[item]);
	}

	res.on('data', function(d) {
		process.stdout.write(d);
  });
});
download_req.end();
download_req.on('error', function(e) {
	console.log('error occurred in HTTPS download GET request'.red);
	console.error(e);
});


/* *****************************************************************
	Test GET/REQUEST from CHECK SURVEYS in HTTPS function for secret header
*******************************************************************/
/*var check_survey_options = {
	hostname: 'capstone-ltemac.herokuapp.com',
	port: 443,
	path: '/check_surveys',
	method: 'GET',
	header: {'secret': '12345-12345-12345-12345-12345'}
};
//set Agent object
check_survey_options.agent = new https.Agent(check_survey_options);

var check_survey_req = https.request(check_survey_options, function(res) {
	console.log('\n\n****GET request https function for CHECK SURVEYS*****'.underline.yellow);
	console.log('statusCode: '.cyan + res.statusCode);
	console.log('headers:'.red);
	for (var item in res.headers){
		console.log('\t' + item.cyan +  ': ' + res.headers[item]);
	}

	res.on('data', function(d) {
		process.stdout.write(d);
  });
});
check_survey_req.end();
check_survey_req.on('error', function(e) {
	console.log('error occurred in HTTPS download GET request'.red);
	console.error(e);
});
*/
