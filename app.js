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
const redis = require("redis");
// const redisClient = require("./db/redis");
const ExpressRedisCache = require('express-redis-cache');

const PORT = process.env.PORT || 8080;
const CACHE_HOST = process.env.REDIS_URL || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const cache = ExpressRedisCache({
  host: CACHE_HOST,
  port: REDIS_PORT,
  auth_pass: REDIS_PASSWORD,
  expire: {
    "200": 5000,
    "4xx": 1,
    "403": 1,
    "5xx": 1,
    "xxx": 1
  }
})


var restRouter = require('./rest/versionController');
var graphQLRouter = require('./graphql/router');

var app = express();
app.set('trust proxy', 1);



const defineCacheEntry = async (req, res, next) => {
  let key = req.originalUrl + '-' + JSON.stringify(req.body);
  res.express_redis_cache_name = key
  next();
};


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
function logging(req, res, next) {
  if (process.env.NODE_ENV != 'production') {
    res.use_express_redis_cache = false;
  }
  const event = {
    referer: req.headers.referer,
    method: req.method,
    url: req.originalUrl,
    body: req.body.query
  }
  console.log("REQUEST\n" + JSON.stringify(event, null, 2));
  res.on('finish', () => {
    console.log("Time in finish", Date.now());
    const finishEvent = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    }

    cache.get(function (error, entries) {
      if ( error ) throw error;
      entries.forEach((entry) => {
        console.log(entry.name);
      })
    });
    if (finishEvent.statusCode >= 400) {
      console.error("RESPONSE\n" + JSON.stringify(finishEvent, null, 2));
    } else {
      console.log("RESPONSE\n" + JSON.stringify(finishEvent, null, 2));
    }
  });
  next();
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

app.use("/rest", logging, defineCacheEntry, cache.route(), restRouter);
app.use("/graphql", logging, defineCacheEntry, cache.route(), graphQLRouter);
app.use('/graphql-playground', expressPlayground({endpoint: '/graphql/'}));
app.use('/docs', express.static('docs-site'));
app.use('/error', function(req, res, next) {
  next(createError(500));
});

app.get('/', function(req, res) {
  res.redirect('docs');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  Sentry.captureException(err);
  // render the error page
  var status = err.status || 500;
  res.status(status).send(createErrorJSON(status, err.message, ""));
});

module.exports = app;
module.exports.handler = serverless(app, {binary: ['image/*']});

if (process.env.NODE_ENV == "production") {
  const sentry_wrapper = Sentry.AWSLambda.wrapHandler(serverless(app, {binary: ['image/*']}));
  const moesif_wrapper = moesif(moesifOptions, sentry_wrapper);
  module.exports.handler = moesif_wrapper;
}

