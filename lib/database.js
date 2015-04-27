var pg = require('pg');

//Connect to LTEMAC's PostgreSQL DB
//Query the DB for the park and protocol requested by the user
//Return the rows to the user

pg.connect(process.env.DATABASE_URL, function(err, client){
	var query = client.query('SELECT * FROM secret');
	query.on('row', function(row){
		console.log(JSON.stringify(row));
	});
});