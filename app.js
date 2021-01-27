// Dotenv is a zero-dependency module that loads environment
// variables from a .env file into process.env
require('dotenv').config();

var createError = require('http-errors');
const {createErrorJSON} = require("./rest/v0/errors.helper");
var { apiKeyAuth } = require("./keys/apiKeyAuth");
var express = require('express');
var cors = require('cors');

var path = require('path');
var logger = require('morgan');
const rateLimit = require("express-rate-limit");

const expressPlayground = require('graphql-playground-middleware-express').default;

var port = process.env.PORT || 8080;

var restRouter = require('./rest/versionController');
var graphQLRouter = require('./graphql/router');
var generateKey = require('./keys/generateKey');

var app = express();

const limiter = rateLimit({
    windowMs: 60 * 1000, // 60 seconds * 1000ms
    max: 100, // limit each IP to 100 requests per windowMs(minute)
    message: createErrorJSON(429, "Too Many Requests", "You have exceeded the rate limit. Please try again later.")
});

var corsOptions = {
  origin: ['http://127.0.0.1:' + port, 'http://api.peterportal.org', 'https://api.peterportal.org'],
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs')

app.use("/rest", apiKeyAuth, restRouter);
app.use("/graphql", apiKeyAuth, graphQLRouter);
app.use('/graphql-playground', expressPlayground({endpoint: '/graphql/', headers: {"x-api-key": process.env.GRAPHQL_API_KEY}}));
app.use('/graphql-docs', express.static('graphql/docs'));
app.use('/docs', express.static('docs-site'));
app.use("/generateKey", generateKey);

app.get('/', function(req, res) {
  res.redirect('/docs')
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

app.listen(port, function() {
  console.log("Server is running on Port: " + port);
});


module.exports = app;
