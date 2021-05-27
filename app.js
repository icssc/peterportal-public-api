// Dotenv is a zero-dependency module that loads environment
// variables from a .env file into process.env
require('dotenv').config();

var createError = require('http-errors');
const serverless = require('serverless-http');
const {createErrorJSON} = require("./helpers/errors.helper");
var express = require('express');
var cors = require('cors');
const compression = require("compression");

var path = require('path');
var logger = require('morgan');
const moesif = require('moesif-nodejs');
const expressPlayground = require('graphql-playground-middleware-express').default;
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");


var port = process.env.PORT || 8080;

var restRouter = require('./rest/versionController');
var graphQLRouter = require('./graphql/router');

var app = express();
app.set('trust proxy', 1);

const moesifMiddleware = moesif({
  applicationId: process.env.MOESIF_KEY,

  // Link API Calls to Api Key
  // getSessionToken: function (req, res) {
  //   return req.headers["x-api-key"] ? req.headers["x-api-key"] : undefined;
  // },
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

var corsOptions = {
  origin: ['http://127.0.0.1:' + port, 'http://api.peterportal.org', 'https://api.peterportal.org'],
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(compression());
app.use(moesifMiddleware);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("./docs-site"));
app.use(express.static("./graphql/docs"));
app.set('view engine', 'ejs')

app.use("/rest", restRouter);
app.use("/graphql", graphQLRouter);
app.use('/graphql-playground', expressPlayground({endpoint: '/graphql/'}));
app.use('/graphql-docs', express.static('graphql/docs'));
app.use('/docs', express.static('docs-site'));

app.get('/', function(req, res) {
  res.redirect('docs');
});

app.use(Sentry.Handlers.errorHandler());

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
  var status = err.status || 500;
  res.status(status).send(createErrorJSON(status, err.message, ""));
});



module.exports = app;
module.exports.handler = serverless(app);
