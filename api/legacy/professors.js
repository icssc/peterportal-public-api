var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
var {executeQuery, escape} = require('../../config/database.js')
var {cacheMiddleware} = require("./cache_v2")

const PROFESSOR_INDEX = "professors";

/**
 * @swagger
 * tags:
 *   name: Professors
 *   description: Professor Information
 */

/**
 * @swagger
 * path:
 *  /professors/all:
 *    get:
 *      summary: Get all professors
 *      tags: [Professors]
 *      responses:
 *        "200":
 *          description: A JSON that maps all professor ucinetid to names
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  count:
 *                    type: integer
 *                    example: 1
 *                  professors:
 *                    type: object
 *                    properties:
 *                      thornton:
 *                        type: string
 *                        description: Professor Name from the Directory.
 *                        example: Alexander W Thornton
 */
router.get("/all", cacheMiddleware, function (req, res, next) {
    getAllProfessors(function (err, data) {
        if (err)
            res.status(400).send(err.toString());
        else {
            res.json(data);
        }
    });
});

// result: data returned from elasticsearch
// returns refined information about all professors
function getAllProfessors(callback) {
    fetch(`${process.env.ELASTIC_ENDPOINT_URL}/${PROFESSOR_INDEX}/_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify({
                "_source": ["ucinetid", "name"],
                "query": {
                    "match_all": {}
                },
                "size": 10000
            })
    }).then((response) => response.json())
    .then((result) => {
        var jsonResult = {}
        result.hits.hits.forEach((e) => {
            jsonResult[e._source.ucinetid] = e._source.name
        })
        callback(null, { count: Object.keys(jsonResult).length, professors: jsonResult });
    })
    .catch((err) => callback(err, null));
}

/**
 * @swagger
 * path:
 *  /professors/{ucinetid}:
 *    get:
 *      summary: Get detailed information for a specific professor
 *      tags: [Professors]
 *      parameters:
 *        - $ref: '#/components/parameters/ucinetidParam'
 *      responses:
 *        "200":
 *          description: Detailed information for a professor
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ProfessorDetails'
 */
router.get("/:ucinetid", cacheMiddleware, function (req, res, next) {
    getProfessor(req.params.ucinetid, function (err, data) {
        if (err)
            res.status(400).send(err.toString());
        else {
            res.json(data);
        }
    });
});

function getProfessor(ucinetid, callback) {
    fetch(`${process.env.ELASTIC_ENDPOINT_URL}/${PROFESSOR_INDEX}/_search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:
            JSON.stringify({
                "query": {
                    "terms": {
                        "_id": [ucinetid]
                    }
                }
            })
    }).then((response) => response.json())
        .then((data) => {
            if(data.hits.hits.length > 0){
                callback(null, data.hits.hits[0]._source)
            }
            else{
                callback(`${ucinetid} does not exist!`, null)
            }
        })
        .catch((err) => callback(err, null));
}

/**
 * @swagger
 * path:
 *  /professors/avgRating/{ucinetid}:
 *    get:
 *      summary: Get average overall rating for a professor
 *      tags: [Professors]
 *      parameters:
 *        - $ref: '#/components/parameters/ucinetidParam'
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
router.get("/avgRating/:ucinetid", function (req, res, next) {
    let sql = `SELECT AVG(rating) AS avgRating
               FROM reviews AS r 
               WHERE r.prof_id = ${escape(req.params.ucinetid)}`
    executeQuery(sql, function (results) {
        res.json(results[0]);
    });
})

/**
 * @swagger
 * path:
 *  /professors/avgRatings/{ucinetid}:
 *    get:
 *      summary: Get average rating for a professor grouped by courses
 *      tags: [Professors]
 *      parameters:
 *        - $ref: '#/components/parameters/ucinetidParam'
 *      responses:
 *        "200":
 *          description: Average rating grouped by courses
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  type: object
 *                  properties:
 *                    avgRating:
 *                      $ref: '#/components/schemas/Rating'
 *                    courseID:
 *                      $ref: '#/components/schemas/CourseID'
 */
router.get("/avgRatings/:ucinetid", function (req, res, next) {
    let sql = `SELECT AVG(rating) AS avgRating, course_id as courseID
               FROM reviews AS r 
               WHERE r.prof_id = ${escape(req.params.ucinetid)}
               GROUP BY course_id`
    executeQuery(sql, function (results) {
        res.json(results);
    });
})

/**
 * @swagger
 * path:
 *  /professors/avgDifficulty/{ucinetid}:
 *    get:
 *      summary: Get average overall difficulty for a professor
 *      tags: [Professors]
 *      parameters:
 *        - $ref: '#/components/parameters/ucinetidParam'
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
router.get("/avgDifficulty/:ucinetid", function (req, res, next) {
    let sql = `SELECT AVG(difficulty) AS avgDifficulty 
               FROM reviews AS r 
               WHERE r.prof_id = ${escape(req.params.ucinetid)}`
    executeQuery(sql, function (results) {
        res.json(results[0]);
    });
})

/**
 * @swagger
 * path:
 *  /professors/avgDifficulties/{ucinetid}:
 *    get:
 *      summary: Get average difficulty for a professor grouped by courses
 *      tags: [Professors]
 *      parameters:
 *        - $ref: '#/components/parameters/ucinetidParam'
 *      responses:
 *        "200":
 *          description: Average difficulty grouped by courses
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  type: object
 *                  properties:
 *                    avgDifficulty:
 *                      $ref: '#/components/schemas/Difficulty'
 *                    courseID:
 *                      $ref: '#/components/schemas/CourseID'
 */
router.get("/avgDifficulties/:ucinetid", function (req, res, next) {
    let sql = `SELECT AVG(difficulty) AS avgRating, course_id as courseID
               FROM reviews AS r 
               WHERE r.prof_id = ${escape(req.params.ucinetid)}
               GROUP BY course_id`
    executeQuery(sql, function (results) {
        res.json(results);
    });
})

module.exports = router;