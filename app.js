
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var store = require('./routes/store');

var app = express();
var server = http.createServer(app);

// Configuration

app.configure(function(){
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', store.home);
app.post('/', store.home_post_handler);

// display the list of item
app.get('/items', store.items);
// show individual item
app.get('/item/:id', store.item);
// show general pages
app.get('/page', store.page);
app.get('/logout', function(req, res) {
    // delete the session variable
    delete req.session.username;
    // redirect user to homepage
    res.redirect('/');
});

server.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
