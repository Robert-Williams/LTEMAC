var http = require('http');
var https = require('https');
var querystring = require('querystring');
var colors = require('colors');
var fs = require('fs');

/* *****************************************************************
	Test POST/REQUEST from UPLOAD function for secret header
	
	reference: http://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
*******************************************************************/

function PostCode(codestring) {
	// Build the post string from an object
	var post_data = querystring.stringify({
		'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
		'output_format': 'json',
		'output_info': 'compiled_code',
		'warning_level' : 'QUIET',
		'js_code' : codestring
	});
	//console.log(post_data.cyan);
	
	var upload_options = {
		secureProtocol: 'TLSv1_method',
		hostname: 'capstone-ltemac.herokuapp.com',
		port: 443,
		path: '/upload',
		method: 'POST',
		header: {'secret': '12345-12345-12345-12345-12345'}
	};
	//set Agent object
	upload_options.agent = new https.Agent(upload_options);

	var upload_req = https.request(upload_options, function(res) {
		console.log('\n\n****POST request https function for upload*****'.underline.yellow);
		console.log('statusCode: '.cyan + res.statusCode);
		console.log('headers:'.red);
		for (var item in res.headers){
			console.log('\t' + item.cyan +  ': ' + res.headers[item]);
		}

		res.on('data', function(d) {
			process.stdout.write(d);
	  });
	});
	upload_req.write(post_data);
	upload_req.end();
	upload_req.on('error', function(e) {
		console.error(e);
	});
	
}


// This is an async file read
var file_name = 'sample_survey.txt';
fs.readFile(file_name, 'utf-8', function (err, data) {
	if (err) {
		// If this were just a small part of the application, you would
		// want to handle this differently, maybe throwing an exception
		// for the caller to handle. Since the file is absolutely essential
		// to the program's functionality, we're going to exit with a fatal
		// error instead.
		console.log('FATAL An error occurred trying to read in the file: ' + err);
		process.exit(-2);
	}
	// Make sure there's data before we post it
	if(data) {
		console.log('data exists in '.green + file_name);
		PostCode(data);
	}
	else {
		console.log('No data to post'.red);
		process.exit(-1);
	}
});