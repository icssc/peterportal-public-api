// Dotenv is a zero-dependency module that loads environment
// variables from a .env file into process.env
require('dotenv').config();

var createError = require('http-errors');
const serverless = require('serverless-http');
const {createErrorJSON} = require("./helpers/errors.helper");
var express = require('express');
var cors = require('cors');

var path = require('path');
var logger = require('morgan');
const compression = require("compression");
const moesif = require('moesif-aws-lambda');
const expressPlayground = require('graphql-playground-middleware-express').default;
const Sentry = require("@sentry/serverless");


var port = process.env.PORT || 8080;

var restRouter = require('./rest/versionController');
var graphQLRouter = require('./graphql/router');

var app = express();
app.set('trust proxy', 1);
let moesifOptions = {};


if (process.env.NODE_ENV == 'production') {
  moesifOptions = {
    applicationId: process.env.MOESIF_KEY,
  
    // Optional hook to link API calls to users
    identifyUser: function (event, context) {
        if (event.requestContext.identity) {
            return event.requestContext.identity.cognitoIdentityId;
        }
        return undefined;
    }
  };
  Sentry.AWSLambda.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
  
}


app.use(cors());
app.use(compression({
  level: 4, //using fourth fastest compression level: https://www.npmjs.com/package/compression
  threshold: "128kb",
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
        // don't compress responses if this request header is present
        return false;
    }

    // fallback to standard compression
    return compression.filter(req, res);
}
}));
app.use(logger('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("./docs-site"));
app.use(express.static("./graphql/docs"));
app.set('view engine', 'ejs')

app.use("/rest", restRouter);
app.use("/graphql", graphQLRouter);
app.use('/graphql-playground', expressPlayground({endpoint: '/graphql/'}));
app.use('/docs', express.static('docs-site'));
app.use('/error', function(req, res, next) {
  next(createError(500));
});

app.get('/', function(req, res) {
  res.redirect('docs');
});

if (process.env.NODE_ENV == 'production') {
  // app.use(Sentry.Handlers.errorHandler());
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
  Sentry.captureException(err);
  // render the error page
  var status = err.status || 500;
  res.status(status).send(createErrorJSON(status, err.message, ""));
});

module.exports = app;

if (process.env.NODE_ENV == "production") {
  const sentry_wrapper = Sentry.AWSLambda.wrapHandler(serverless(app, {binary: ['image/*']}));
  const moesif_wrapper = moesif(moesifOptions, sentry_wrapper);
  module.exports.handler = moesif_wrapper;
}

