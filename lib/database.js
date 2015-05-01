var pg = require('pg');

exports.checkSecret = function(secret){
	var client = new pg.Client(process.env.DATABASE_URL);
	client.connect();

	//Form the query for checking the secret
	console.log('Forming query string.');
	secret = '\'' + secret + '\'';
	var query = 'select * from secret where secret = ' + secret;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(query, function(err, result) {
			done();
			if (err) {
				console.error(err); console.log('Error ' + err);
			}
			else {
				console.log('Secret found: ' + JSON.stringify(result.rows));
				return result.rows;
			}
		});
	});
};

exports.getRows = function(park, protocol){
	//Form the query for retrieving desired survey(s)
	var query = 'select * from survey where park =' + park + ' and protocol = ' + protocol;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(query, function(err, result) {
			done();
			if (err) {
				console.error(err); console.log('Error ' + err);
			}
			else {
				console.log('Rows found: ' + result.rows);
			}
		});
	});

	console.log('Returning rows: ' + result.rows);
	return result.rows;
};

exports.insertSurvey = function(park, protocol, survey, version){
	return undefined;
};

exports.checkSurveys = function(){
	return undefined;
};
