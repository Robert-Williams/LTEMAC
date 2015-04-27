var pg = require('pg');

//Connect to LTEMAC's PostgreSQL DB
//Query the DB for the park and protocol requested by the user
//Return the rows to the user

var conString = process.env.DATABASE_URL;

var client = new pg.Client(conString);
client.connect();

var query = client.query("select * from secret");

query.on("row", function(row, result) {
	result.addRow(row);
});

query.on("end", function(result){
	console.log(JSON.stringify(result.rows, null, "   "));
	client.end();
});