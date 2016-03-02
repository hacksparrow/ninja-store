var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require ('express-session');
var store = require('./routes/store');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
/*
 Failure to set "saveUninitialized" and "resave" will generate two warnings:
 express-session deprecated undefined resave option; provide resave option app.js:7:9
 express-session deprecated undefined saveUninitialized option; provide saveUninitialized option app.js:7:9
 This is simply saying the default values will change so they want to ensure that by setting the values
 explicitly now. By doing this you  won't run into unexpected behavior if the defaults do change in the
 near future.
*/
app.use(session({
	secret: 'qwertzuiopasdfghjklyxcvbnm',
	cookie: { maxAge: 100000 },
	saveUninitialized: true, // (default: true)
	resave: true, // (default: true)
	}));

// GET and POST for root Page
app.get('/', store.home);
app.post('/', store.home_post_handler);
// display the list of item
app.get('/items', store.items);
// show individual item
app.get('/item/:id', store.item);
// show general pages
app.get('/page', store.page);
// logout link
app.get('/logout', function(req, res) {
    // delete the session variable
    delete req.session.username;
    // redirect user to homepage
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
