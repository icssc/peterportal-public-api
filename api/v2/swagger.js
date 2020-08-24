var express = require("express");
var router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger set up
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Peter Portal",
            version: "2.0.0",
            description:
                "Coming Soon!",
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
                url: "http://localhost:5000/api/v2",
                description: "Local Development"
            },
            {
                url: "https://peter-portal.com/api/v2",
                description: "Production Environment"
            }
        ]
    },
    apis: ["./api/v2/v2.js"]
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