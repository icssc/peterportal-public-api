var express = require("express");
var router = express.Router();

var { apiKeyAuth } = require("../apiKeyAuth");
var {getAllCourses} = require('./courses.helper')

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course Descriptions
 */

/**
 * @swagger
 * path:
 *  /courses/all:
 *    get:
 *      summary: Get all courses
 *      tags: [Courses]
 *      responses:
 *        "200":
 *          description: A JSON of all courses available on the UCI Catalogue. It uses courseID as keys 
 *                       pointing to a JSON value containing other useful information on that course 
 *                       (department, number, title, and description). 
 *                       This endpoint is useful for implementing search feature on your application.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  count:
 *                    type: integer
 *                    example: 1
 *                  courses:
 *                    type: object
 *                    properties:
 *                      I&CSCI46:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: Data Structure Implementation and Analysis
 */

router.get("/all", apiKeyAuth, function (req, res, next) {
    res.json(getAllCourses());
})

module.exports = router;
