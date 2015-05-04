var pg = require('pg');

function imageAuth(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level > 1){
		res.send(process.env.MEDIA_SECRET || 'media secret');
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthroized Access');
	}
}

function getSurveys(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level > 1){
		
		//Setup a query to get all surveys from database
		var queryString = '';
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
	if(authorization.active && authorization.user_level > 1){
		var park = req.query.park;
		var protocol = req.query.protocol;

		//Check is request parameters are valid
		if(park !== undefined && protocol !== undefined){

			//Setup a query to get all surveys from database
			var queryString = 'select * from survey where park =\'' + park + '\' and protocol = \'' + protocol + '\'';

				//query for secret
				pg.connect(process.env.DATABASE_URL, function(err, client, done) {
					var query = client.query(queryString);

					//When a row is returned
					query.on('row', function(row, result){
						console.log('Row: ' + row);
						result.addRow(row);
					});

					//When query has finished
					query.on('end', function(result){
						console.log(result);

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
