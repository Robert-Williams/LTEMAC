//Use to see if request is coming over https
exports.connection = function(request){
	if(request.headers['X-Forwarded-Proto'] === 'https'){
		return true;
	}

	return false;
};

//Use to authorize request
exports.auth = function(){
	console.log('hello user');
};
