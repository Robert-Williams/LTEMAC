function imageAuth(req, res, authLevel){

};

function getSurveys(req, res, authLevel){

};

function download(req, res, authLevel){

};

function upload(req, res, authLevel){

};

function missingPage(req, res, authLevel){
	res.status(404);
	res.send('404 - Not Found');
};

exports.imageAuth = imageAuth;
exports.getSurveys = getSurveys;
exports.download = download;
exports.upload = upload;
exports.missingPage;
