// Dotenv is a zero-dependency module that loads environment 
// variables from a .env file into process.env
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const PORT = 4000;
const expressPlayground = require('graphql-playground-middleware-express').default;

var restRouter = require('./rest/versionController');
var generateKey = require('./keys/generateKey');

var app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

app.use("/rest", restRouter);
app.use("/graphql", graphQLRouter);
app.use('/graphql-playground', expressPlayground({endpoint: '/graphql/'}));
app.use('/graphql-docs', express.static('graphql/docs'));
app.use("/generateKey", generateKey);
app.get('/', function(req, res) {

app.get('/', function(req, res) {
  res.redirect('/rest/v0/docs')
  // res.render('pages/index');
});

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
  res.status(err.status || 500).send(err.message);
});

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

module.exports = app;
