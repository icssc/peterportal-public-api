const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const uuid = require('uuid')
const nodemailer = require('nodemailer')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const emailTemplates = require('email-templates')

const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY});
const {
  Get,
  Select,
  Collection,
  Match,
  Index,
  Create,
  Lambda,
  Var,
  Update,
  Date : qDate,
} = faunadb.query;

var path = require('path')
const { createErrorJSON } = require('../rest/v0/errors.helper')

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID, // ClientID
  process.env.OAUTH_CLIENT_SECRET, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MAILER_USER,
//     pass: process.env.MAILER_PASS
//       }
// });

function createEmail() {
  oauth2Client.setCredentials({
      refresh_token: process.env.OAUTH_REFRESH
  });
  const accessToken = oauth2Client.getAccessToken().catch(err => {console.log(err); return null;});
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: "OAuth2",
      user: "peterportal.dev@gmail.com", 
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH,
      accessToken: accessToken
  }
  });
  
  const email = new emailTemplates({
    transport: transporter,
    send: true,
    preview: false,
    views: {
        options: {
          extension: 'ejs',
        },
        root: path.resolve('email'),
      }
  });
  return email;
}

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: "OAuth2",
//     user: "peterportal.dev@gmail.com", 
//     clientId: process.env.OAUTH_CLIENT_ID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH,
//     accessToken: accessToken
// }
// });

// const email = new emailTemplates({
//   transport: transporter,
//   send: true,
//   preview: false,
//   views: {
//       options: {
//         extension: 'ejs',
//       },
//       root: path.resolve('email'),
//     }
// });

var port = process.env.PORT || 8080;
const url = process.env.NODE_ENV == 'development' ? "http://localhost:" + port : "https://api.peterportal.org"

// router.get("/", function (req, res, next) {
//     res.send(generateApiKey())
// });

router.post("/", function (req, res, next) {
    var key = generateApiKey();
    key = req.body.app_name.replace(/ /g, "_") + "-" + key;
    const hash = crypto.createHash('sha256');
    var hashed_key = hash.update(key).digest('hex');
    const data = {
        api_key: hashed_key,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        app_name: req.body.app_name,
        app_description: req.body.app_description,
        website_url: req.body.website_url,
        key_status: "Awaiting Verification",
        created_on: new Date(),
        num_requests: 0
      }
    insertApiKeyToDatabase(data).then((ret) => {
      console.log(ret.data); 
      sendVerificationEmail(data, key)
    });
    res.send("Finished!")
});

router.get("/confirm/:key", function (req, res, next) {

  activateAPIKey(req.params.key).then((ret) => {
    console.log("returned", ret);
    var success = sendAPIKeyEmail(ret.data, req.params.key);
    if (success)
      res.send("Your API key has been confirmed. See your email for the api key. \n Visit our documentation here: https://api.peterportal.org");
    else
      res.status(500).send(createErrorJSON(500, "Internal Server Error", ""))
    }).catch((err) => {
    console.log(err);
    res.status(500).send(createErrorJSON(500, "Internal Server Error", ""))
  });
  
});

async function insertApiKeyToDatabase(data) {
  const ret = await client.query( 
    Create(
      Collection("api_keys"), {
        data: {
          "key": data.api_key,
          "first_name": data.first_name,
          "last_name": data.last_name,
          "email": data.email,
          "app": {
            "name": data.app_name,
            "description": data.app_description,
            "url": data.website_url,
          },
          "status": data.key_status,
          "created_on": data.created_on,
          "num_requests": 0
        }
      })
  ).catch((err) => console.log(err));
  return ret;
}

async function activateAPIKey(key) {

  const hashed_key = crypto.createHash('sha256').update(key).digest('hex');
  const ret = await client.query(
    Update(
      Select("ref",
        Get(
          Match(Index("keys_by_key"), hashed_key)
        )
      ),
      {
        data: {
          status: "active",
        },
      },
    )
  ).catch((err) => console.log(err));
  return ret;
}

function sendVerificationEmail(data, key) {   
  const email = createEmail(); 
  if (email == null) {
    return false;
  }
  email.send({
    template: 'apiConfirmation',
    message: {
      from: 'PeterPortal API <peterportal.dev@gmail.com>',
      to: data['email'],
    },
    locals: {
      firstName: data['first_name'],
      appName: data['app_name'],
      confirmationURL: url + '/generateKey/confirm/' + key,
      unsubscribeURL: url + '/unsubscribe/' + data['email']
    },
  }).then(() => {console.log('email has been sent!'); return true})
  .catch((err) => {console.log(err); return false;});
}

function sendAPIKeyEmail(data, key) {     
  const email = createEmail();  
  if (email == null) {
    return false;
  }
  email.send({
    template: 'apiKeyDelivery',
    message: {
      from: 'PeterPortal API <peterportal.dev@gmail.com>',
      to: data['email'],
    },
    locals: {
      apiKey: key,
      appName: data['app']['name'],
      unsubscribeURL: url + '/unsubscribe/' + data['email']
    },
  }).then(() => {console.log('email has been sent!'); return true})
.catch((err) => {console.log(err); return false;});
}

function generateApiKey() {
    return crypto.createHash('sha256').update(uuid.v4()).update(crypto.randomBytes(256)).digest('hex');
}

module.exports = router;