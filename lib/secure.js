var pg = require('pg');

//Use to see if request is coming over https
exports.connection = function(req, res, callback){
	if(req.headers['x-forwarded-proto'] === 'https'){

		//Check if secret exists
		if(req.headers.secret){

			//Check that secret is right shape
			if((req.headers.secret.match(/^[01]{1}\w{4}-\w{5}-\w{5}-\w{5}-\w{5}$/).length === 1 ? true : false)){

				//perform authorization query and supply provided callback
				var queryString = 'select * from secret where secret = \'' + req.headers.secret + '\'';

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
						result.addRow(row);
					});

					//When query has finished
					query.on('end', function(result){

						done();
						//Check if there was a row returned
						if(result.rowCount === 1){
							callback(req, res, result);
						}

						//There was no matching secret in the database
						else{
							res.type('text/plain');
							res.status(401);
							res.send('401 - Unauthorized Access');
						}
					});
				});
			}

			//Secret is wrong shape
			else{
				res.type('text/plain');
				res.status(400);
				res.send('400 - Bad Request');
			}
		}

		//Missing secret header
		else{
			console.log('Missing secret header\n');
			res.type('text/plain');
			res.status(400);
			res.send('400 - Bad Request');
		}
	}

	//Attempting to use HTTP instead of HTTPS
	else{
		res.type('text/plain');
		res.status(497);
		res.send('497 - HTTP to HTTPS');
	}
};
