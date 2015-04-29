var pg = require('pg');

//Connect to LTEMAC's PostgreSQL DB
//Query the DB for the park and protocol requested by the user
//Return the rows to the user

function checkSecret(secret){
	var conString = process.env.DATABASE_URL;

	var client = new pg.Client(conString);
	client.connect();

	//secret = '\'' + secret + '\'';

	var query = client.query('select * from secret where secret = ' + secret);

	query.on('row', function(row, result) {
		result.addRow(row);
	});

	query.on('end', function(result){
		client.end();
		return result.userLevel;
	});
}

function getRows(){

	return 0;
}
