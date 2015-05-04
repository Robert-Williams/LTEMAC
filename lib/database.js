var pg = require('pg');

exports.checkSecret = function(secret, callback){
	//Form the query for checking the secret
	secret = '\'' + secret + '\'';
	var queryString = 'select * from secret where secret = ' + secret;
	var query = client.query(queryString);

	query.on('row', function(row, result){
		console.log('Got: ' + JSON.stringify(row));
		result.addRow(row);
	});
	
	query.on('end', function(result){
		return result;
	}) 
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
