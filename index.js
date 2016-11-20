var express = require("express");
var Yelp = require("yelp");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();

var yelp = new Yelp({
  consumer_key: 'clwZtQfpk-KazHR3puO2fQ',
  consumer_secret: 'oxta26y83keOzrEfODJ5oqEXWFE',
  token: '-BOuVydFW0j-CRDbfZBSiQ-PMjul8cK_',
  token_secret: 'blzRg8H_6BrhjNW02bopF18ucVg',
});

mongoose.connect("mongodb://test:test@ds053156.mlab.com:53156/mongodb-test-valentino", function (err) {
	
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	}
	
	else {
		console.log('Connection established');
	}
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var str ="";

mongoose.connection.once("open", function(err){
	
	if(err){
		console.log(err);
	}
	
	else{
		
		var schema = mongoose.Schema({
			name: {unique: true, type: String},
			persons: {type: Number}
		});
		
		var Going = mongoose.model("Places", schema);
	}

	app.post("/url", function(req, res){
	
		var loc = req.body.loc;
		str="";
	
		yelp.search({ term: 'food', location: loc, limit:20 })
			.then(function (data) {
			
				res.json(data);
			})
			.catch(function (err) {
				console.error(err);
			});
 
		console.log(loc);
	
	});
	
});

app.listen(process.env.PORT||8080);