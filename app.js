
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var {pool} = require("./config/database")

// var indexRouter = require('./routes/index');
var apiRouter = require('./api/versionController');
// var usersRouter = require('./routes/users');
// var reviewsRouter = require('./routes/reviews');
// var coursesRouter = require('./routes/courses');
// var professorsRouter = require('./routes/professors');
// var adminRouter = require('./routes/admin');

var app = express();

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60 * 24},
  store: new MySQLStore({}, pool)
}));
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport.js")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

app.use("/", apiRouter);

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