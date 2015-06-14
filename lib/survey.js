var pg = require('pg');
var mandrill = require('mandrill-api');

function imageAuth(req, res, auth){
	var authorization = auth.rows[0];

	sendEmail('User is getting image auth data.', 'LTEMAC Alert');
	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){
		// MUST: insecure, suggest npm config for managing configurations instead of process.env
		
		var result = {
			auth_level: authorization.user_level,
			access_token: process.env.ACCESS_TOKEN || 'Access Token',
			access_secret: process.env.ACCESS_SECRET || 'Access Secret',
			consumer_key: process.env.CONSUMER_KEY || 'Consumer Key',
			consumer_secret: process.env.CONSUMER_SECRET || 'Consumer Secret',
		};

		res.send(result);
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthorized Secret');
	}
}

function getSurveys(req, res, auth){
	var authorization = auth.rows[0];

	sendEmail('User is checking survey list.', 'LTEMAC Alert');

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){
		
		//Setup a query to get all surveys from database
		var queryString = 'select date_surveyed, version_no, site_survey_guid, park_id, protocol_id from surveys';
		
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			// SHOULD: handle err
			var query = client.query(queryString);

			//When bad things happen respond, otherwise the server crashes
			query.on('error', function(error){
				console.log(error);
				res.type('text/plain');
				res.status(500);
				res.send('500 - Database Error');
			});

			query.on('row', function(row, result){
				result.addRow(row);
			});
			
			query.on('end', function(result){
				done();
				res.send(result);
			});
		});
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthorized Access');
	}
}

function download(req, res, auth){
	var authorization = auth.rows[0];
	sendEmail('User is attempting to download', 'LTEMAC Alert');

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){
		var guid = req.param('id');

		//Check is request parameters are valid
		if(guid){

			//Setup a query to get all surveys from database
			var queryString = 'select * from surveys where site_survey_guid =\'' + guid + '\'';
				
			//query for secret
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				var query = client.query(queryString);

				//When bad things happen respond, otherwise the server crashes
				query.on('error', function(error){
					console.log(error);
					res.type('text/plain');
					res.status(500);
					res.send('500 - Something Bad Happened');
				});

				//When a row is returned
				query.on('row', function(row, result){
					console.log('Row: ' + row);
					result.addRow(row);
				});

				//When query has finished
				query.on('end', function(result){

					done();
					//Check if there was a row returned
					if(result.rowCount === 1){
						res.send(result.rows[0]);
					}

					//There was no survey matching the query
					else{
						res.type('text/plain');
						res.status(404);
						res.send('404 - Not Found');
					}
				});
			});
		}
		//The parameters for this request were malformed
		else{
			res.type('text/plain');
			res.status(400);
			res.send('400 - Bad Request');
		}
	}
	//Secret is not authorized
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthorized Access');
	}
}

function upload(req, res, auth){

	console.log(auth.rows[0]);
	console.log('User level is:' + auth.rows[0].user_level + '\n' + 'Type is: ' + (typeof auth.rows[0].user_level));
	var start = 'Starting upload.';
	sendEmail('User is attempting to upload', 'LTEMAC Alert');
	console.log(start);

	var authorization = auth.rows[0];
	
	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){

		var body = req.body;
		console.log('Body');
		console.log(body);
		
		console.log('Req.Body');
		console.log(req.body);
		
		var data = {
			guid: body.guid,
			park: body.park,
			protocol: body.protocol,
			survey: body.survey_data,
			date: body.date_surveyed,
			version: body.version_no
		};
		
		//Check is request parameters are valid
		if(data.guid && data.survey){

			//Setup a query to get all surveys from database
			var queryString = 'select site_survey_guid, version_no, date_surveyed from surveys where site_survey_guid =\'' + data['guid'] + '\'';
				
			//query for secret
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				var query = client.query(queryString);

				//When bad things happen respond, otherwise the server crashes
				query.on('error', function(error){
					console.log(error);
					res.type('text/plain');
					res.status(500);
					res.send('500 - Database Error');
				});

				//When a row is returned
				query.on('row', function(row, result){
					console.log('Row: ' + row);
					result.addRow(row);
				});

				//When query has finished
				query.on('end', function(result){

					done();

					if(result.rowCount === 0){
						//Insert the new survey
						console.log("Inserting new survey data.");

						var currentDate = new Date()
						var now = currentDate.toISOString();

						var queryString = 'insert into surveys (site_survey_guid, park_id, protocol_id, survey_data, date_surveyed, last_modified, version_no) VALUES (' +
											'\'' + data.guid + '\',' +
											data.park + ',' +
											data.protocol + ',' +
											'\'' + JSON.stringify(data.survey) + '\',' +
											'\'' + data.date + '\',' +
											'\'' + now + '\',' +
											1 +
											')';
						//console.log(data.survey);
						//console.log(queryString);

						pg.connect(process.env.DATABASE_URL, function(err, client, done) {
							var query = client.query(queryString);

							query.on('error', function(error){
								console.log(error);
								res.type('text/plain');
								res.status(500);
								res.send('500 - Database Error');
							});

							query.on('end', function(result){
								done();

								res.send('New Survey Uploaded');
							});

						});

					}
					else if(result.rowCount === 1){
						//Try to overwrite the existing survey
						
						if(auth.rows[0].user_level === 9){
							if(auth.rows[0].user_level === 9){
								console.log('Overwriting a server with administrative privilege.');
							}
							//console.log(result);
							var currentDate = new Date()
							var now = currentDate.toISOString();

							console.log("Overwriting old survey data.")
							
							var versionNumber = data.version + 1;
							console.log('\n\n\nVersion Number: ' + versionNumber + '\n\n\n');
							
							var queryString = 'update surveys set survey_data = \'' + JSON.stringify(data.survey) + '\',' +
													'park_id =' + data.park + ',' +
													'protocol_id =' + data.protocol + ',' +
													'date_surveyed = \'' + data.date + '\',' +
													'last_modified = \'' + now + '\',' +
													'version_no = ' + versionNumber + ' ' +
													'WHERE site_survey_guid = \'' + data.guid + '\'';
							console.log(queryString);

							pg.connect(process.env.DATABASE_URL, function(err, client, done) {
								var query = client.query(queryString);

								query.on('error', function(error){
									console.log(error);
									res.type('text/plain');
									res.status(500);
									res.send('500 - Database Error');
								});


								query.on('end', function(result){
									done();
									res.send('Old Survey Updated');
								});

							});
						}
						//Secret not authorized to overwrite recent survey
						else{
							res.type('text/plain');
							// SHOULD: shouldn't this be a 401 http status?
							res.status(500);
							res.send('500 - Insufficient permission to update survey');
						}
					}
					//There are multiple duplicate surveys
					else{
						//Database Error
						res.type('text/plain');
						res.status(500);
						res.send('500 - Duplicate Surveys');
					}
				});
			});
		}
		//The parameters for this request were malformed
		else{
			res.type('text/plain');
			res.status(400);
			res.send('400 - Bad Request');
		}
	}
	//Secret is not authorized
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthorized Secret');
	}
}

function missingPage(req, res, auth){
	res.status(404);
	res.send('404 - Not Found');
}

function sendEmail(text, subject){
	mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);
    var message = {
        "html": "<p>" + text + "</p>",
        "text": text,
        "subject": subject,
        "from_email": process.env.MANDRILL_USERNAME,
        "from_name": null,
        "to": [{
                "email": process.env.SUPERVISOR_EMAIL,
                "name": null,
                "type": "to"
            }],
        "headers": {
            "Reply-To": "message.reply@example.com"
        },
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "bcc_address": "message.bcc_address@example.com",
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "merge": true,
        "merge_language": "mailchimp",
        "tags": [
            "Test"
        ]
    };
    var async = false;
    var ip_pool = "Main Pool";
    var send_at = "0";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        console.log(result);
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}

exports.imageAuth = imageAuth;
exports.getSurveys = getSurveys;
exports.download = download;
exports.upload = upload;
exports.missingPage = missingPage;
