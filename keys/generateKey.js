const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const emailTemplates = require('email-templates')
var path = require('path')
var {executeQuery, escape, executeQueryWithCallback} = require('../config/database.js')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'peterportal.dev@gmail.com',
    pass: '$P3terTh3Ant3at3r$'
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

router.get("/", function (req, res, next) {
    res.send(generateApiKey())
});

router.post("/", function (req, res, next) {
    const data = {
        apiKey: req.body.appName.replace(/ /g, "_") + "-" + generateApiKey(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        appName: req.body.appName,
        appDescription: req.body.appDescription,
        websiteURL: req.body.websiteURL ? req.body.websiteURL : null,
        keyStatus: "Awaiting Verification",
        createdOn: new Date()
      }

    insertApiKeyToDatabase(data).then(sendVerificationEmail(data))
    res.json(data)
});

router.get("/confirm/:apiKey", function (req, res, next) {
  let sql = `SELECT * FROM api_keys WHERE apiKey = ${escape(req.params.apiKey)};`

  executeQueryWithCallback(sql, function(results) {
    activateAPIKey(req.params.apiKey).then(sendAPIKeyEmail(results[0])).then(res.send("confirmed " + req.params.apiKey));
  })
});

async function insertApiKeyToDatabase(data) {
  let sql = `INSERT INTO api_keys
  (apiKey, firstName, lastName, email, appName, appDescription, websiteURL, keyStatus, createdOn)
  VALUES( ${escape(data.apiKey)},
          ${escape(data.firstName)}, 
          ${escape(data.lastName)}, 
          ${escape(data.email)}, 
          ${escape(data.appName)}, 
          ${escape(data.appDescription)}, 
          ${escape(data.websiteURL)}, 
          ${escape(data.keyStatus)},
          ${escape(data.createdOn)});`

  executeQuery(sql)
}

async function activateAPIKey(key) {
  let sql = `UPDATE api_keys SET keyStatus = 'Active' WHERE apiKey = ${escape(key)};`

  executeQuery(sql)
}

function sendVerificationEmail(data) {    
  email.send({
    template: 'apiConfirmation',
    message: {
      from: 'PeterPortal API <peterportal.dev@gmail.com>',
      to: 'peterportal.dev@gmail.com',
    },
    locals: {
      firstName: data['firstName'],
      appName: data['appName'],
      confirmationURL: 'http://localhost:5000/generateKey/confirm/' + data['apiKey'],
      unsubscribeURL: 'http://localhost:5000/unsubscribe/' + data['email']
    },
  }).then(() => console.log('email has been send!'));
}

function sendAPIKeyEmail(data) {    
  email.send({
    template: 'apiKeyDelivery',
    message: {
      from: 'PeterPortal API <peterportal.dev@gmail.com>',
      to: 'peterportal.dev@gmail.com',
    },
    locals: {
      apiKey: data['apiKey'],
      appName: data['appName'],
      unsubscribeURL: 'http://localhost:5000/unsubscribe/' + data['email']
    },
  }).then(() => console.log('email has been send!'));
}

function generateApiKey() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

module.exports = router;