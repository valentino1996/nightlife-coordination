var express = require("express");
var Yelp = require("yelp");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

var app = express();

var yelp = new Yelp({
  consumer_key: 'clwZtQfpk-KazHR3puO2fQ',
  consumer_secret: 'oxta26y83keOzrEfODJ5oqEXWFE',
  token: '-BOuVydFW0j-CRDbfZBSiQ-PMjul8cK_',
  token_secret: 'blzRg8H_6BrhjNW02bopF18ucVg'
});
  
var token='2538355556-Jfbhqubjts1KUZq4FuWv7W6phmskvwc9YjUHTob';
var tokenSecret='aqqDTgeV0vUmJDAqSt9PojULNNmMq8T30DclSZX389LSN';

//after adding this line of code I was able to make this kinda working
//var User={findOrCreate:function(){}}; //this is wrong

passport.use(new TwitterStrategy({
    consumerKey: '9k7QBl1PumkC00snE9Qm4Srqn',
    consumerSecret: 'frvscEtdk78q9pp08AVS4OYPvNFYHEnKBWUB9KSTwmn1lZvGsM',
    callbackURL: "http://127.0.0.1:8080/"
  },
  function(token, tokenSecret, profile, done) {
    //User.findOrCreate({ twitterId: profile.id }, function(err, user) {
		//console.log(profile.id);
		//console.log(user);
		//if (err){ 
		//console.log(err);
		//return done(err); }
		//console.log(done(null, user));
		console.log(profile);
		console.log("df");
		return done(null, profile);
    //});
  }
));


/*
var client = new Twitter({
  consumer_key: '9k7QBl1PumkC00snE9Qm4Srqn',
  consumer_secret: 'frvscEtdk78q9pp08AVS4OYPvNFYHEnKBWUB9KSTwmn1lZvGsM',
  access_token_key: '2538355556-Jfbhqubjts1KUZq4FuWv7W6phmskvwc9YjUHTob',
  access_token_secret: 'aqqDTgeV0vUmJDAqSt9PojULNNmMq8T30DclSZX389LSN'
});
*/
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

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla' 
}));

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
	
	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/oauth/authenticate',
		passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
	
});

app.listen(process.env.PORT||8080);