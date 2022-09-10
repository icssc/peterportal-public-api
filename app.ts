// Dotenv is a zero-dependency module that loads environment
// variables from a .env file into process.env
import "dotenv/config";

import * as Sentry from "@sentry/serverless";
import compression from "compression";
import cors from "cors";
import express from "express";
import expressPlayground from "graphql-playground-middleware-express";
import logger from "morgan";
import path from "path";
import serverless from "serverless-http";

import graphQLRouter from "./graphql/router";
import { createErrorJSON } from "./helpers/errors.helper";
import restRouter from "./rest/versionController";

const app = express();
app.set("trust proxy", 1);

if (process.env.NODE_ENV == "production") {
  Sentry.AWSLambda.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}
const logging = (req, res, next) => {
  if (process.argv.includes("--log") || process.env.NODE_ENV == "production") {
    const event = {
      referer: req.headers.referer,
      method: req.method,
      url: req.originalUrl,
      body: req.body.query,
    };
    console.log("REQUEST\n" + JSON.stringify(event, null, 2));

    res.on("finish", () => {
      const finishEvent = {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
      };
      if (finishEvent.statusCode >= 400) {
        console.error("RESPONSE\n" + JSON.stringify(finishEvent, null, 2));
      } else {
        console.log("RESPONSE\n" + JSON.stringify(finishEvent, null, 2));
      }
    });
  }
  next();
};

app.use(cors());
app.use(
  compression({
    level: 4, //using fourth fastest compression level: https://www.npmjs.com/package/compression
    threshold: "128kb",
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        // don't compress responses if this request header is present
        return false;
      }

      // fallback to standard compression
      return compression.filter(req, res);
    },
  })
);
app.use(logger("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("./docs-site"));
app.use(express.static("./graphql/docs"));
app.set("view engine", "ejs");

app.use("/rest", logging, restRouter);
app.use("/graphql", logging, graphQLRouter);
app.use("/graphql-playground", expressPlayground({ endpoint: "/graphql/" }));
app.use("/docs", express.static("docs-site"));

app.get("/", function (req, res) {
  res.redirect("docs");
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
  res
    .status(404)
    .json(
      createErrorJSON(404, "Not Found", "The requested resource was not found.")
    );
});

// error handler
const errorHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  const status = err.status || 500;
  res.status(status).json(createErrorJSON(status, err.message, ""));
};
app.use(errorHandler);

let serverless_handler: any = serverless(app, { binary: ["image/*"] });
if (process.env.NODE_ENV == "production") {
  serverless_handler = Sentry.AWSLambda.wrapHandler(serverless_handler);
}

export default app;
export const handler = serverless_handler;
