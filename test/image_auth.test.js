var https = require('https');
var color = require('colors');

var options = {
  hostname: 'capstone-ltemac.herokuapp.com',
  port: 443,
  path: '/image_auth',
  method: 'GET',
  headers: {secret: '12345-12345-12345-12345-12345'},
};

var req = https.request(options, function(res) {
  console.log(color.green("statusCode: ") + res.statusCode);
  console.log("headers: ", res.headers);

  res.on('data', function(d) {
    console.log('Message: ' + (d.toString('utf-8')));
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});