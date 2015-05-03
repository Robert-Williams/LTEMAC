var database = require('./database.js');

//Use to see if request is coming over https
exports.connection = function(req, res, callback){
	if(request.headers['x-forwarded-proto'] === 'https'){
		//Check if secret exists
		if(req.headers.secret){
			var secretPattern = new RegExp('^[01]{1}\w{4}-\w{5}-\w{5}-\w{5}-\w{5}$');
			//Check that secret is right shape
			if(secretPattern.test(req.headers.secret)){
				//perform authorization query and supply provided callback
				var queryString = 'select * from secret where secret = \'' + req.headers.secret + '\'';
				
				//query stuff
				
				
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

//Use to authorize request
//return the one of the following auth levels
//0 - unauthorized
//1 - user
//9 - super user
exports.auth = function(request, callback){
	var authLevel = 0;

	//Check if user sent secret
	if(request.headers.secret){
		var secretPattern = new RegExp('^[01]{1}\w{4}-\w{5}-\w{5}-\w{5}-\w{5}$');
		var secret = request.headers.secret;
		secret = '\'' + secret + '\'';
		var queryString = 'select * from secret where secret = ' + secret;

		//test if secret is right shape
		if(secretPattern.test(secret)){
			pg.connect(process.env.DATABASE_URL, function(err, client, done) {
				var query = client.query(queryString);

				query.on('row', function(row){
					console.log('Result: ' + JSON.stringify(row));
					callback(row);
				});
			});
		};
	};
};