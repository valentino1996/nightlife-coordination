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

var user="";
var bool=false;
var arr=[];
var user_arr=[];

mongoose.connection.once("open", function(err){
	
	if(err){
		console.log(err);
	}
	
	else{
		
		var schema = mongoose.Schema({
			user_id: {unique: true, type: Number},
			places_id: {type: Array}
		});
		
		var User = mongoose.model("User", schema);
		
		var places = mongoose.Schema({
			id: {unique:true, type:Number},
			places: {type:Array}
		});
		
		var Places = mongoose.model("Places", places);
		
		Places.create({id:1, places:[]}, function(err, snippet){
			
			console.log("created new db places");
			return;
			
		});
		
	}
	
	passport.use(new TwitterStrategy({
		consumerKey: '9k7QBl1PumkC00snE9Qm4Srqn',
		consumerSecret: 'frvscEtdk78q9pp08AVS4OYPvNFYHEnKBWUB9KSTwmn1lZvGsM',
		callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		
			console.log(profile.id);
			user=profile.id;
			
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
		
		if(user==""){
			console.log("redirecting...");
			res.redirect("/auth/twitter");
			return;
		}
		
		User.create({user_id: user, places_id: name}, function(err, snippet){
			
			if(err||!snippet){
				console.log("User not created");
				return;
			}
			
			console.log("new user created");
			bool=true;
			res.json({a:1});
		});
		
		//if(bool=true){
			/*Places.findOne({id:1}, function(err, snippet){
				arr = snippet.places;
				if(snippet.places.indexOf(name)==-1){
					arr.push([name,1]);
					bool=false
					return;*/
		//}
		//else{
			User.findOne({user_id: user}, function(err, snippet){
				console.log("user found");
				user_arr=snippet.places_id;
				console.log(user_arr);
				if(user_arr.indexOf(name)==-1){
					user_arr.push(name);
					User.findOneAndUpdate({user_id:user},{places_id: user_arr}, function(err, snippet){
						console.log("snippet updated");
					});
					res.json({a:1});
				}
				else{
					user_arr.splice(user_arr.indexOf(name),1);
					User.findOneAndUpdate({user_id:user},{places_id: user_arr}, function(err, snippet){
						console.log("snippet updated");
					});
					res.json({a:0});
				}
			});
					
		//}
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