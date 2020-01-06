// let middleware = require('./middleware');
require('dotenv').config()
var express = require('express');
var app = express();
const Sentry = require('@sentry/node');

// Sentry.init({ dsn: '__PUBLIC_DSN__' });
// Sentry.init({ dsn: 'secret' });
// Sentry.init({ dsn: 'https://<key>@sentry.io/<project>' });



// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
// The error handler must be before any other error middleware
// app.use(Sentry.Handlers.errorHandler());

app.use(Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Capture all 404 and 500 errors
    if (error.status === 404 || error.status === 500) {
      return true
    }
    return false
  }
}));



var createError = require('http-errors');


var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var profileRouter = require('./routes/profile');




const jwt = require('jsonwebtoken')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // gives access to the public folder

// app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

// const user = {
//     username: 'test',
//     email: 'test@test.test'
// }

app.post('/jwt', (req, res) => {

	// the user should be in the database, not hardcoded 
  const user = {
    username: 'test',
    email: 'test@test.test'
  }

  jwt.sign({user}, 'secretkey', { expiresIn: '3000s' }, (err, token) => {
    res.json({
      token
    });
  });
});

app.get('/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json({
        message: 'Authorization succesful',
      });
    }
  });
})

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if(typeof authHeader !== 'undefined') {
    const bearer = authHeader.split(' ');
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(500);
  }

}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
