var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
var { executeQuery, escape } = require('../../config/database.js')
var { cacheMiddleware } = require("./cache_v2")

const COURSE_INDEX = "courses";

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
 *          description: A JSON that maps all course ids to names
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
router.get("/all", cacheMiddleware, function (req, res, next) {
    getAllCourses(function (err, data) {
        if (err)
            res.status(400).send(err.toString());
        else {
            res.json(data);
        }
    });
});

// result: data returned from elasticsearch
// returns refined information about all courses
function getAllCourses(callback) {
    fetch(`${process.env.ELASTIC_ENDPOINT_URL}/${COURSE_INDEX}/_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify({
                "_source": ["id", "name"],
                "query": {
                    "match_all": {}
                },
                "size": 10000
            })
    }).then((response) => response.json())
        .then((result) => {
            var jsonResult = {}
            result.hits.hits.forEach((e) => {
                jsonResult[e._source.id.replace(/ /g, '')] = e._source.name
            })
            callback(null, { count: Object.keys(jsonResult).length, courses: jsonResult });
        })
        .catch((err) => callback(err, null));
}

/**
 * @swagger
 * path:
 *  /courses/{courseID}:
 *    get:
 *      summary: Get detailed information for a specific course
 *      tags: [Courses]
 *      parameters:
 *        - in: path
 *          name: courseID
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/CourseID'
 *      responses:
 *        "200":
 *          description: Detailed information for a course
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CourseDetails'
 */
router.get("/:courseID", cacheMiddleware, function (req, res, next) {
    getCourse(req.params.courseID, function (err, data) {
        if (err)
            res.status(400).send(err.toString());
        else {
            res.json(data);
        }
    });
});

function getCourse(id, callback) {
    fetch(`${process.env.ELASTIC_ENDPOINT_URL}/${COURSE_INDEX}/_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify({
                "query": {
                    "terms": {
                        "_id": [id]
                    }
                }
            })
    }).then((response) => response.json())
        .then((data) => {
            if (data.hits.hits.length > 0) {
                callback(null, data.hits.hits[0]._source)
            }
            else {
                callback(`${id} does not exist!`, null)
            }
        })
        .catch((err) => callback(err, null));
}

/**
 * @swagger
 * path:
 *  /courses/avgRating/{courseID}:
 *    get:
 *      summary: Get average overall rating for a course
 *      tags: [Courses]
 *      parameters:
 *        - $ref: '#/components/parameters/courseIDParam'
 *      responses:
 *        "200":
 *          description: Average overall rating
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  avgRating:
 *                    $ref: '#/components/schemas/Rating'
 */
router.get("/avgRating/:courseID", function (req, res, next) {
    let sql = `SELECT AVG(rating) AS avgRating
               FROM reviews AS r 
               WHERE r.course_id = ${escape(req.params.courseID)}`
    console.log(sql);
    executeQuery(sql, function (results) {
        res.json(results[0]);
    });
})

/**
 * @swagger
 * path:
 *  /courses/avgRatings/{courseID}:
 *    get:
 *      summary: Get average rating for a course grouped by professors
 *      tags: [Courses]
 *      parameters:
 *        - $ref: '#/components/parameters/courseIDParam'
 *      responses:
 *        "200":
 *          description: Average rating grouped by professors
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  type: object
 *                  properties:
 *                    avgRating:
 *                      $ref: '#/components/schemas/Rating'
 *                    ucinetid:
 *                      $ref: '#/components/schemas/Ucinetid'
 */
router.get("/avgRatings/:courseID", function (req, res, next) {
    let sql = `SELECT AVG(rating) AS avgRating, prof_id as ucinetid
               FROM reviews AS r 
               WHERE r.course_id = ${escape(req.params.courseID)}
               GROUP BY prof_id`
    executeQuery(sql, function (results) {
        res.json(results);
    });
})

/**
 * @swagger
 * path:
 *  /courses/avgDifficulty/{courseID}:
 *    get:
 *      summary: Get average overall difficulty for a course
 *      tags: [Courses]
 *      parameters:
 *        - $ref: '#/components/parameters/courseIDParam'
 *      responses:
 *        "200":
 *          description: Average overall difficulty
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  avgDifficulty:
 *                    $ref: '#/components/schemas/Difficulty'
 */
router.get("/avgDifficulty/:courseID", function (req, res, next) {
    let sql = `SELECT AVG(difficulty) AS avgDifficulty 
               FROM reviews AS r 
               WHERE r.course_id = ${escape(req.params.courseID)}`
    executeQuery(sql, function (results) {
        res.json(results[0]);
    });
})

/**
 * @swagger
 * path:
 *  /courses/avgDifficulties/{courseID}:
 *    get:
 *      summary: Get average difficulty for a course grouped by professors
 *      tags: [Courses]
 *      parameters:
 *        - $ref: '#/components/parameters/courseIDParam'
 *      responses:
 *        "200":
 *          description: Average difficulty grouped by professors
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  type: object
 *                  properties:
 *                    avgDifficulty:
 *                      $ref: '#/components/schemas/Difficulty'
 *                    ucinetid:
 *                      $ref: '#/components/schemas/Ucinetid'
 */
router.get("/avgDifficulties/:courseID", function (req, res, next) {
    let sql = `SELECT AVG(difficulty) AS avgDifficulty, prof_id as ucinetid
               FROM reviews AS r 
               WHERE r.course_id = ${escape(req.params.courseID)}
               GROUP BY prof_id`
    executeQuery(sql, function (results) {
        res.json(results);
    });
})

module.exports = router;