function imageAuth(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level > 1){
		res.send(process.env.MEDIA_SECRET || 'media secret');
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthroized Access');
	}
}

function getSurveys(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level > 1){
		
		//Setup a query to get all surveys from database
		var queryString = '';
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthroized Access');
	}
}

function download(req, res, auth){
	var authorization = auth.rows[0];

	//Check if user is authorized for this action
	if(authorization.active && authorization.user_level > 1){
		var park = req.query.park;
		var protocol = req.query.protocol;

		//Check is request parameters are valid
		if(park !== undefined && protocol !== undefined){

			//Setup a query to get all surveys from database
			var queryString = '';
		}

		//The parameters for this request were malformed
		else{
			res.type('text/plain');
			res.status(400);
			res.send('400 - Bad Request');
		}
	}
	else{
		res.type('text/plain');
		res.status(401);
		res.send('401 - Unauthroized Access');
	}
}

function upload(req, res, auth){

}

function missingPage(req, res, auth){
	res.status(404);
	res.send('404 - Not Found');
}

exports.imageAuth = imageAuth;
exports.getSurveys = getSurveys;
exports.download = download;
exports.upload = upload;
exports.missingPage = missingPage;
