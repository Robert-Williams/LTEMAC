var pg = require('pg');
var when = require('node-promise').when;

exports.checkSecret = function(secret){
	//Form the query for checking the secret
	secret = '\'' + secret + '\'';
	var queryString = 'select * from secret where secret = ' + secret;
	
	var callback = function(result){
		console.log("REsult: " + result);
	};
	
	when(pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		var query = client.query(queryString);

		query.on('row', function(row){
			console.log('Result: ' + JSON.stringify(row));
			callback('stuff');
		});
		
	}), callback(result));
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
