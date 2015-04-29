var database = require('./database.js');

//Use to see if request is coming over https
exports.connection = function(request){
	if(request.headers['x-forwarded-proto'] === 'https'){
		return true;
	}

	return false;
};

//Use to authorize request
//return the one of the following auth levels
//0 - unauthorized
//1 - user
//9 - super user
exports.auth = function(request){
	var authLevel = 0;

	//Check if user sent secret
	if(request.headers.secret){
		var secretPattern = new RegExp('^[01]{1}\w{4}-\w{5}-\w{5}-\w{5}-\w{5}$');
		var secret = request.headers.secret;

		//test if secret is right shape
		if(secretPattern.test(secret)){
			authLevel = database.checkSecret(secret);
		}
	}
	
	console.log('Secret: ' + secret + ', AuthLevel: ' + authLevel);
	return authLevel;
};

//Send authorized user media storage key
exports.mediaSecret = function(){
	console.log('Here\'s your secret');
};
