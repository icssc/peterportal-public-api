var express = require("express");
var router = express.Router();
var path = require('path');
const swaggerJSDoc = require("swagger-jsdoc");


const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        components: {},
        info: {
            title: "PeterPortal Public API",
            version: "Beta 1.0.0",
            description: 
                `<br><h1>Introduction</h1>
                <p>PeterPortal Public API provides software developers with easy-access to UC Irvine publicly available data 
                such as: courses information, professor information, and schedule of classes. We consolidate our data directly 
                from official UCI sources such as: UCI Catalogue, UCI Directory, UCI Public Records Office, and UCI Webreg. 
                We routinely monitor for updates to ensure you get the most accurate information to serve on your application.</p>
                <br><br>
                <h1>Our Mission</h1>
                Our mission is to improve the UCI student experience with course planning and encourage 
                student software developers to create open-source applications that are benefical to the
                Anteater community.
                <br><br>
                zot zot zot.
                `,
            'x-logo': {
                "url": "/images/peterportal-banner-logo.png",
                "altText": "PeterPortal Logo",
                "href": "/"
                },
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "ICSSC Project Committee",
                email: "peterportal.dev@gmail.com"
            }
        },
        servers: [
            {
                url: "http://localhost:5000/api/v0",
                description: "Local Development"
            },
            {
                url: "https://peter-portal.com/api/v0",
                description: "Production Environment"
            }
        ],
    },
    apis: [path.join(__dirname, "../v0/courses.js")]
};

const swaggerSpec = swaggerJSDoc(options);

router.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

router.get('/', (req, res) => {
    res.send("Please refer to the doc in our Discord.")
    // res.sendFile(path.join(__dirname, 'redoc.html'));
});


module.exports = router;