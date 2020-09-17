var express = require("express");
var router = express.Router();

var { apiKeyAuth } = require("../../keys/apiKeyAuth");
var {getAllCourses, getSpecificCourse} = require('./courses.helper')

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
 *      summary: Get all courses.
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

/**
 * @swagger
 * path:
 *  /courses/{courseID}:
 *    get:
 *      summary: Get detailed information on a specific course.
 *      tags: [Courses]
 *      responses:
 *        "200":
 *          description: A JSON of informations on a specific courses.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  I&CSCI46:
 *                    type: object
 *                    properties:
 *                      department:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: I&C SCI
 *                      department_name:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: I&C SCI
 *                      number:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: 46
 *                      school:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: Donald Bren School of Information and Computer Sciences
 *                      title:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: Data Structure Implementation and Analysis
 *                      course_level:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: Lower Division (1-99)
 *                      department_alias:
 *                        type: array[string]
 *                        description: Course Name from the Catalogue.
 *                        example: ["ICS"]
 *                      units:
 *                        type: array[int, int]
 *                        description: Course Name from the Catalogue.
 *                        example: [4, 4]
 *                      description:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: Focuses on implementation and mathematical analysis of fundamental data structures and algorithms. Covers storage allocation and memory management techniques.
 *                      professor_history:
 *                        type: array[string]
 *                        description: Course Name from the Catalogue.
 *                        example: ["sgagomas", "klefstad", "pattis", "thornton"]
 *                      prerequisite_tree:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "{\"OR\":[\"CSE 45C\",\"I&C SCI 45C\"]}"
 *                      prerequisite_list:
 *                        type: array[string]
 *                        description: Course Name from the Catalogue.
 *                        example: ["I&C SCI 45C", "CSE 45C"]
 *                      prerequisite_text:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "( CSE 45C OR I&C SCI 45C ) AND ( NO REPEATS ALLOWED IF GRADE = C OR BETTER ) AND ( SCHOOL OF I&C SCI ONLY OR COMPUTER SCI & ENGR MAJORS ONLY )"
 *                      dependency_list:
 *                        type: array[string]
 *                        description: Course Name from the Catalogue.
 *                        example: ["COMPSCI 111", "COMPSCI 116", "COMPSCI 117", "COMPSCI 141", "COMPSCI 143A", "COMPSCI 145", "COMPSCI 146", "COMPSCI 161", "COMPSCI 162", "COMPSCI 164", "COMPSCI 171", "COMPSCI 190", m"COMPSCI 216", "COMPSCI 217", "COMPSCI 261", "EECS 111", "IN4MATX 101", "IN4MATX 115", "IN4MATX 122", "LSCI 102"]
 *                      repeatability:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "May be taken for credit for 18 units."
 *                      grading_option:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "Pass/no pass only."
 *                      concurrent:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "..."
 *                      same_as:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "..."
 *                      restriction:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "..."
 *                      overlaps:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: "..."
 *                      corequisite:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: I&C SCI 53
 *                      ge_list:
 *                        type: array[string]
 *                        description: Course Name from the Catalogue.
 *                        example: ["GE Vb: Formal Reasoning"]
 *                      ge_text:
 *                        type: string
 *                        description: Course Name from the Catalogue.
 *                        example: (Vb)
 *                      terms:
 *                        type: array[string]
 *                        description: Course Name from the Catalogue.
 *                        example: ["2020 Fall", "2019 Spring"]
 * 
 * 
 */
router.get("/:courseID", apiKeyAuth, function (req, res, next) {
    
    getSpecificCourse(req.params.courseID) ? res.json(getSpecificCourse(req.params.courseID)) : res.status(404).send("Course not found");
})

module.exports = router;
