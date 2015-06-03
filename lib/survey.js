var pg = require('pg');

function imageAuth(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){
		// MUST: insecure, suggest npm config for managing configurations instead of process.env
		res.send(process.env.MEDIA_SECRET || 'media secret');
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthorized Secret');
	}
}

function getSurveys(req, res, auth){
	var authorization = auth.rows[0];

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
	console.log(start);

	var authorization = auth.rows[0];
	
	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){

		var body = req.body[0];

		var data = {
			guid: body.guid,
			park: body.park_id,
			protocol: body.protocol_id,
			survey: body.survey_data,
			date: body.date_surveyed,
			version: body.version_no
		};
		
		//Check is request parameters are valid
		if(data.guid && data.survey){

			//Setup a query to get all surveys from database
			var queryString = 'select site_survey_guid, version_no, date_surveyed, exported from surveys where site_survey_guid =\'' + data['guid'] + '\'';
				
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

						var queryString = 'insert into surveys VALUES (' +
											'\'' + data.guid + '\',' +
											data.park + ',' +
											data.protocol + ',' +
											'\'' + JSON.stringify(data.survey) + '\',' +
											'\'' + data.date + '\',' +
											'\'' + now + '\',' +
											1 +
											')';
						console.log(data.survey);
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

								res.send('New Survey Uploaded');
							});

						});

					}
					else if(result.rowCount === 1){
						//Try to overwrite the existing survey
						
						if(auth.rows[0].user_level === 9 || result.rows[0].exported === true){
							if(auth.rows[0].user_level === 9){
								console.log('Overwriting a server with administrative privilege.');
							}
							if(result.rows[0].exported === true){
								console.log('Overwriting a survey that has been exported.');
							}
							console.log(result);
							var currentDate = new Date()
							var now = currentDate.toISOString();

							console.log("Overwriting old survey data.")
							var queryString = 'update surveys set survey_data = \'' + JSON.stringify(data.survey) + '\',' +
													'park_id =' + data.park + ',' +
													'protocol_id =' + data.protocol + ',' +
													'date_surveyed = \'' + data.date + '\',' +
													'last_modified = \'' + now + '\',' +
													'version_no = ' + (data.version++) + ' ' +
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

exports.imageAuth = imageAuth;
exports.getSurveys = getSurveys;
exports.download = download;
exports.upload = upload;
exports.missingPage = missingPage;
