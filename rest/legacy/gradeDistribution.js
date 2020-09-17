var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
var { executeQuery, escape } = require('../../config/database.js')
var { cacheMiddleware } = require("./cache_v2")

/**
 * @swagger
 * tags:
 *   name: Grade Distribution
 *   description: Grade Distribution Information
 */


/**
 * @swagger
 * path:
 *  /gradeDistribution/{courseID}:
 *    get:
 *      summary: Get grade distribution for a course
 *      tags: [Grade Distribution]
 *      parameters:
 *        - $ref: '#/components/parameters/courseIDParam'
 *      responses:
 *        "200":
 *          description: Grade distribution of course in different terms
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/GradeDetails'
 */
router.get("/:courseID", cacheMiddleware, function (req, res, next) {
    let sql = `SELECT *
               FROM grade_distribution 
               WHERE courseID = ${escape(req.params.courseID)}`
    executeQuery(sql, function (results) {
        console.log(results);
        res.json(results);
    });
});

module.exports = router;