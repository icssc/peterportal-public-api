var express = require("express");
var router = express.Router();
var path = require('path');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger set up
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Peter Portal",
            version: "1.0.0",
            description:
                "PeterPortal is a web application aimed to aid UCI students with course discovery. We consolidate public data available on multiple UCI sources on the application to improve the user experience when planning their course schedule.",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "Peter Anteater",
                url: "https://peter-portal.com/contact",
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
        ]
    },
    apis: [path.join(__dirname, "schemas.yaml"), 
           path.join(__dirname, "parameters.yaml"), 
           path.join(__dirname, "courses.js"), 
           path.join(__dirname, "professors.js"), 
           path.join(__dirname, "schedule.js"),
           path.join(__dirname, "gradeDistribution.js")]
};
const specs = swaggerJsdoc(options);
router.use("/", swaggerUi.serve);
router.get(
    "/",
    swaggerUi.setup(specs, {
        explorer: true
    })
);

module.exports = router;