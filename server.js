var http = require('http');
var url = require('url');
var qs = require('querystring');
var mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('littledata', server);

http.createServer(function (req, res) {
	if (req.method == 'OPTIONS') {
    res.writeHead(200, "OK", {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*"
      });
    res.end();
  } else if (req.method === 'POST') {
			
			var contentType = req.headers["content-type"];
			
			if (contentType) {
			//console.log(res); (first verify the request in your console)
			var body = '';
			//I was thinking about setting res.setEncoding('utf8'), but don't bother
			req.on('data', function(data) { body += data});
			req.on('end', function() {
				
				//process and save to mongo
				var obj = qs.parse(body);
				res.writeHead(200, "OK", {'Content-Type': 'text/html'});
				res.write('<html><head><title>Thank you</title>');
				res.write('<link rel=\"\stylesheet\"\ href=\"\//s3.amazonaws.com/littlebitbucket/assets/css/nodejs.css\"\ type=\"\text/css\"\ />');
				res.write('</head><body>');
				res.write('<div><img src=\"\https://s3.amazonaws.com/littlebitbucket/assets/images/littlelogo.png\"\>');
				res.write('<h2>OK great! We will email you when the product is back in stock</h2></div>');
				res.write('<div><h4><a href=\"\http://market.littlebits.cc\"\>Click here to resume shopping</a></h4></div>');
				res.write('</body></html>');
				res.end();
				console.log(obj);
				db.open(function(err, db) {
					if(!err) { 
						console.log("MongoDB connected");
						db.collection('littlecollection', function(err, collection) {
								collection.insert(obj, {safe:true}, function(err, result) {
									db.close();
								});
						});
					}
				});
			});
			}
		}
	}).listen(4000);
console.log("Listening on port 4000...");