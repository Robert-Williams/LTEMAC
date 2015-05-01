var pg = require('pg');

exports.checkSecret = function(secret){
	var client = new pg.Client(process.env.DATABASE_URL);
	client.connect();

	//Form the query for checking the secret
	secret = '\'' + secret + '\'';
	var query = client.query('select * from secret where secret = ' + secret);

	//Add any rows returned by the query to the output
	query.on('row', function(row, result) {
		result.addRow(row);
	});

	//CLose the connection when the query ends
	query.on('end', function(result){
		client.end();
		console.log('Returned user level: ' + result.userLevel);
		return result.userLevel;
	});

};

exports.getRows = function(park, protocol){
	var client = new pg.Client(process.env.DATABASE_URL);
	client.connect();

	//Form the query for retrieving desired survey(s)
	var query = client.query('select * from survey where park =' + park + ' and protocol = ' + protocol);

	//Add any returned rows to the result
	query.on('row', function(row, result) {
		result.addRow(row);
	});

	//Return the query as JSON and close the connection when the query ends
	query.on('end', function(result){
		client.end();
		return result.userLevel;
	});

};

exports.insertSurvey = function(park, protocol, survey, version){
	return undefined;
};

exports.checkSurveys = function(){
	return undefined;
};
