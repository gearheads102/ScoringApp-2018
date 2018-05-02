var express = require('express');				//main express shiz
var path = require('path');						//for filesystem
var favicon = require('serve-favicon');			//serves favicon
var logger = require('morgan'); 				//logger
var bodyParser = require('body-parser');		//parses http request information
var session = require('express-session');		//session middleware (uses cookies)
var passport = require('passport');				//for user sessions
var fs = require('fs');							//for reading whether this device is server or not
var Client = require('node-rest-client').Client;//for reading from REST APIs (e.g., TheBlueAlliance)
var useragent = require('express-useragent');	//for info on connected users
var colors = require('colors');					//for pretty debugging
var monk = require("monk");						//Monk for connecting to db

var db = monk("localhost:27017/local");			//Local db on localhost
var useFunctions = require('./useFunctions');	//Functions inside separate module for app.use
var client = new Client();						//Creates node-rest-client.

var app = express();							//Creates app.
//app.debug is used in res.log custom function. If true, res.log("message", "color", [override?]); will log. If not, will not.
app.debug = false;

var thisFuncName = "app.js: ";
if (app.debug) console.log(thisFuncName + 'ENTER');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));
app.use(useragent.express());

require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	req.db = db;
	req.passport = passport;
	next();
});
//sets view engine vars for user
app.use(useFunctions.userViewVars);
//Event stuff
app.use(useFunctions.getEventInfo);
//Logging and timestamping
app.use(useFunctions.logger);
//adds logging to res.render function
app.use(useFunctions.renderLogger);

if (app.debug) console.log(thisFuncName + 'Require routes');

//ADD ROUTES HERE
var index = require('./routes/index');
var adminindex = require('./routes/adminindex');
var login = require('./routes/login');
var scoutingpairs = require('./routes/scoutingpairs');
var teammembers = require("./routes/teammembers");
var externaldata = require("./routes/externaldata");
var dashboard = require("./routes/dashboard");
var admindashboard = require("./routes/admindashboard");
var scouting = require("./routes/scouting");
var current = require("./routes/current");
var reports = require('./routes/reports');
var allianceselection = require('./routes/allianceselection');
//var reports2 = require('./routes/reports2');

if (app.debug) console.log(thisFuncName + 'URLs to routes');

//CONNECT URLS TO ROUTES
app.use('/', index);
app.use('/admin', adminindex);
app.use('/login', login);
app.use('/admin/scoutingpairs', scoutingpairs);
app.use("/admin/teammembers", teammembers);
app.use('/admin/data', externaldata);
app.use('/admin/current', current);
app.use('/admin/dashboard', admindashboard);
app.use('/scouting', scouting);
app.use("/dashboard", dashboard);
app.use('/reports', reports);
app.use('/allianceselection', allianceselection);
//app.use('/reports2', reports2);

if (app.debug) console.log(thisFuncName + 'After URLs to routes');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//reads if server is marked as dev or not
fs.readFile('./isDev', "binary", function(err, data){
	if(err)
		console.log(err);
		app.locals.isDev = false;
	if(data){
		console.log("isDev: " + data);
		//set isDev equal to data (true or false)
		app.locals.isDev = (data == 'true');
	}
});

//reads if server is marked as SERVER or not (currently not used, but we might wanna add something)
fs.readFile('./isServer', "binary", function(err, data){
	if(err)
		console.log(err);
		app.locals.isServer = false;
	if(data){
		console.log("isServer: " + data);
		//set isServer equal to data (true or false)
		app.locals.isServer = (data == 'true');
	}
});

if (app.debug) console.log(thisFuncName + 'DONE');

module.exports = app;