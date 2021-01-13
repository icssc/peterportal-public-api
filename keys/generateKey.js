const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const nodemailer = require('nodemailer')
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
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

const url = process.env.NODE_ENV == 'development' ? "http:/localhost:" + process.env.PORT : "http://api.peterportal.org"

router.get("/", function (req, res, next) {
    res.send(generateApiKey())
});

router.post("/", function (req, res, next) {
    const data = {
        api_key: req.body.app_name.replace(/ /g, "_") + "-" + generateApiKey(),
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
    console.log("Data:", data);
    insertApiKeyToDatabase(data).then((ret) => {console.log(ret.data); sendVerificationEmail(ret.data)})
    res.send("Finished!")
});

router.get("/confirm/:key", function (req, res, next) {

  activateAPIKey(req.params.key).then((ret) => {
    console.log("returned", ret);
    sendAPIKeyEmail(ret.data);
    res.send("confirmed " + req.params.key);
  }).catch((err) => {console.log(err)});
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
  const ret = await client.query(
    Update(
      Select("ref",
        Get(
          Match(Index("keys_by_key"), key)
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

function sendVerificationEmail(data) {    
  email.send({
    template: 'apiConfirmation',
    message: {
      from: 'PeterPortal API <peterportal.dev@gmail.com>',
      to: data['email'],
    },
    locals: {
      firstName: data['first_name'],
      appName: data['app']['name'],
      confirmationURL: url + '/generateKey/confirm/' + data['key'],
      unsubscribeURL: url + '/unsubscribe/' + data['email']
    },
  }).then(() => console.log('email has been sent!'))
  .catch((err) => console.log(err));
}

function sendAPIKeyEmail(data) {    
  email.send({
    template: 'apiKeyDelivery',
    message: {
      from: 'PeterPortal API <peterportal.dev@gmail.com>',
      to: data['email'],
    },
    locals: {
      apiKey: data['key'],
      appName: data['app_name'],
      unsubscribeURL: url + '/unsubscribe/' + data['email']
    },
  }).then(() => console.log('email has been sent!'));
}

function generateApiKey() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

module.exports = router;