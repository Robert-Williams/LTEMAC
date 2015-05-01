exports.upload = function(authLevel, survey, res){
	var result = {
		contentType: 'text/plain',
		status: 200,
		code: '200 - Good Request'
	};

	return result;
};

exports.download = function(park, protocol){
	var result = {};
	result.status = 'good';
	result.content = 'blob';

	return result;
};
