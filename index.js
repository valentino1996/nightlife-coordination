var express = require("express");
var Yelp = require("yelp");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var findOrCreate = require("mongoose-findorcreate");
var Strategy = require("passport-strategy");
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
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla' 
}));

var user;

mongoose.connection.once("open", function(err){
	
	if(err){
		console.log(err);
	}
	
	else{
		
		var schema = mongoose.Schema({
			id: {unique: true, type: Number},
			places: {type: Array}
		});
		
		var User = mongoose.model("User", schema);
	}
	
	passport.use(new TwitterStrategy({
		consumerKey: '9k7QBl1PumkC00snE9Qm4Srqn',
		consumerSecret: 'frvscEtdk78q9pp08AVS4OYPvNFYHEnKBWUB9KSTwmn1lZvGsM',
		callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		
			console.log(profile.id);
			user=Number(profile.id);
			
			passport.serializeUser(function(user, done) {
				done(null, user);
			});

			passport.deserializeUser(function(user, done) {
				done(null, user);
			});
			
			return done(null, profile.id);
			
		}
	));

	app.post("/url", function(req, res){
	
		var loc = req.body.loc;
	
		yelp.search({ term: 'food', location: loc, limit:20 })
			.then(function (data) {
			
				res.json(data);
			})
			.catch(function (err) {
				console.error(err);
			});
 
		console.log(loc);
	
	});
	
	app.post("/places", function(req, res){
		
		var name = req.body.name;
		console.log(name);
		
	});
	
	app.get('/auth/twitter', passport.authenticate('twitter'));
	
	app.get("/login", function(req, res){
		res.send("something went wrong");
	})

	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
	
});

app.listen(process.env.PORT||8080);