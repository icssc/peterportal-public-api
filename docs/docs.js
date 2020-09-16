var express = require("express");
var router = express.Router();
var path = require('path');
const swaggerJSDoc = require("swagger-jsdoc");


const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "PeterPortal Public API",
            version: "Beta 1.0.0",
            description: 
                `<h1>Introduction</h1><p>PeterPortal Public API provides software developers with easy-access to UC Irvine publicly available data 
                such as: courses information, professor information, and schedule of classes. We consolidate our data directly 
                from official UCI sources such as: UCI Catalogue, UCI Directory, UCI Public Records Office, and UCI Webreg. 
                We routinely monitor for updates to ensure you get the most accurate information to serve on your application.</p>
                <br><br>
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
                url: "http://localhost:5000/api/v1",
                description: "Local Development"
            },
            {
                url: "https://peter-portal.com/api/v1",
                description: "Production Environment"
            }
        ],
    },
    apis: [path.join(__dirname, "../api/v1/schemas.yaml"), 
            path.join(__dirname, "../api/v1/parameters.yaml"), 
            path.join(__dirname, "../api/v1/courses.js")]
};

const swaggerSpec = swaggerJSDoc(options);

router.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'redoc.html'));
});


module.exports = router;