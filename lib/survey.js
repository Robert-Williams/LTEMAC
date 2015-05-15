var pg = require('pg');

function imageAuth(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){
		res.send(process.env.MEDIA_SECRET || 'media secret');
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthorized Access');
	}
}

function getSurveys(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){
		
		//Setup a query to get all surveys from database
		var queryString = 'select site, protocol, date_surveyed, version_no from surveys';
		
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var query = client.query(queryString);

			//When bad things happen respond, otherwise the server crashes
			query.on('error', function(error){
				console.log(error);
				res.type('text/plain');
				res.status(500);
				res.send('500 - Something Bad Happened');
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
		res.send('401 - Unauthroized Access');
	}
}

function download(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){
		var park = req.query.park;
		var protocol = req.query.protocol;

		//Check is request parameters are valid
		if(park !== undefined && protocol !== undefined){

			//Setup a query to get all surveys from database
			var queryString = 'select * from surveys where site =\'' + park + '\' and protocol = \'' + protocol + '\'';
				
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
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthroized Access');
	}
}

function upload(req, res, auth){
	var start = 'Starting upload.';
	console.log(start);

	var authorization = auth.rows[0];
	
	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level >= 1){

		var body = req.body[0];

		var data = {
			site: body.site,
			protocol: body.protocol,
			survey: body.survey_data,
			date: body.date_surveyed,
			version: body.version_no
		};
		
		//Check is request parameters are valid
		if((data['site'] !== undefined) && (data['protocol'] !== undefined) && (data['survey'] !== undefined)){

			//Setup a query to get all surveys from database
			var queryString = 'select site, protocol, version_no, date_surveyed from surveys where site =\'' + data['site'] + '\' and protocol = \'' + data['protocol'] + '\'';
				
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

					if(result.rowCount === 0){
						//Insert the new survey
						console.log("Inserting new survey data.");

						currentDate = new Date()
						

						now = currentDate.toISOString();

						var queryString = 'insert into surveys VALUES (\'' + data['site'] + '\',\''  + data['protocol'] + '\',' + data['survey'] + ',' + data['date'] + ',\'' + now + '\',' + 1 + ')';
						console.log(queryString);

						pg.connect(process.env.DATABASE_URL, function(err, client, done) {
							var query = client.query(queryString);

							query.on('error', function(error){
								console.log(error);
								res.type('text/plain');
								res.status(500);
								res.send('500 - Something Bad Happened');
							});

							query.on('end', function(result){
								done();
								res.send('New Survey Uploaded');
							});

						});

					}
					else if(result.rowCount === 1){	//TODO: Add date based acceptance
						//Try to overwrite the old survey
						if(auth.user_level === 9){
							console.log("Overwriting old survey data.")
							var queryString = 'update surveys set survey_data = \'' + data['survey'] 
													+ '\', date_surveyed = \'' + data['date'] 
													+ '\', last_modified = \'' + data.modified 
													+ '\', version_no = ' + (data['version']++)
													+ ' WHERE site = \'' + data['site'] 
													+ '\' AND protocol = \'' + data['protocol'] + '\'';
							console.log(queryString);

							pg.connect(process.env.DATABASE_URL, function(err, client, done) {
								var query = client.query(queryString);

								query.on('error', function(error){
									console.log(error);
									res.type('text/plain');
									res.status(500);S
									res.send('500 - Something Bad Happened');
								});


								query.on('end', function(result){
									done();
									res.send('Old Survey Updated');
								});

							});
						}
						else{
							//Database Error
							res.type('text/plain');
							res.status(500);
							res.send('500 - Insufficient permission to update survey');
						}
					}
					else{
						//Database Error
						res.type('text/plain');
						res.status(500);
						res.send('500 - Something Bad Happened');
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
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthroized Access');
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
