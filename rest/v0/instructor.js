var express = require("express");
var router = express.Router();

var { apiKeyAuth } = require("../../keys/apiKeyAuth");
var {getAllInstructors, getSpecificInstructor} = require('./Instructor.helper')


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
 *      summary: Get a collection of all courses with minimal info.
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

router.get("/all", function (req, res, next) {
    res.json(getAllInstructors());
})

/**
 * @swagger
 * path:
 *  /courses/{courseID}:
 *    get:
 *      summary: Get detailed information on a specific course.
 *      tags: [Courses]
 *      responses:
 *        "200":
 *          description: A JSON of informations on a specific course.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  department:
 *                    type: string
 *                    description: Department short-hand name
 *                    example: I&C SCI
 *                  number:
 *                    type: string
 *                    example: "46"                  
 */

router.get("/:ucinetid", apiKeyAuth, function (req, res, next) {
    getSpecificInstructor(req.params.ucinetid) ? res.json(getSpecificInstructor(req.params.ucinetid)) : res.status(404).send("Instructor not found");
})


module.exports = router;
