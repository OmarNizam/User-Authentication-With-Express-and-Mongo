var express = require('express');  // to make the app work
var bodyParser = require('body-parser'); // to read the body of requests send to the server by the browser
var app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public')); // tell express to serve static assets like pictures and stylesheets from public folder

// view engine setup
app.set('view engine', 'pug'); // tell express that we want to use the pug template engine
app.set('views', __dirname + '/views'); // tell express where to find our pug templates

// include routes  // setup our routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
