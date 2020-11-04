var express = require("express");
var router = express.Router();

// "We recommend that you create your client connection object 
// within your handler functions so that you have a fresh connection 
// object for each thawed context. All FaunaDB connections are light-weight 
// HTTP connections, with HTTP KeepAlive enabled by default, so there is no 
// performance advantage to creating client connection objects outside of your handlers."
// https://docs.fauna.com/fauna/current/drivers/known_issues

const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY});

const {
    Paginate,
    Get,
    Intersection,
    Match,
    Index,
    Lambda,
    Var,
    Union,
    Map
} = faunadb.query;

var { apiKeyAuth } = require("../../keys/apiKeyAuth");

/**
 * @swagger
 * tags:
 *   name: Grade Distribution
 *   description: Grade Distribution data source (provided by the UCI Public Records Office)
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

router.get("/", async function (req, res, next) {
    let query = []
    
    if (req.query.year) {
        let year_index = []
        for (year of req.query.year.split(";")) {
            year.match(/\d{4}-\d{2}/) ? year_index.push(Match(Index("grade_distribution_query_by_year"), year)) : 
            res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + year + "` in the [year] query value");
        }
        if(year_index.length > 0) { query.push(Union(...year_index)); }
    }

    if (req.query.quarter) {
        let quarter_index = []
        for (quarter of req.query.quarter.split(";")) {
            quarter.match(/[a-zA-Z]{4,6}/) ? quarter_index.push(Match(Index("grade_distribution_query_by_quarter"), quarter[0].toUpperCase() + quarter.slice(1).toLowerCase())) : 
            res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + quarter + "` in the [quarter] query value");
        }
        if (quarter_index.length > 0) { query.push(Union(...quarter_index)); }
    }
    
    if (req.query.instructor) {
        let instructor_index = []
        for (instructor of req.query.instructor.split(";")) {
            instructor.match(/[a-zA-Z]+, [a-zA-Z]\./) ? instructor_index.push(Match(Index("grade_distribution_query_by_instructor"), instructor.toUpperCase())) : 
            res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + instructor + "` in the [instructor] query value");
        }
        if (instructor_index.length > 0) { query.push(Union(...instructor_index)); }
    }

    if (req.query.department) {
        let department_index = []
        for (department of req.query.department.split(";")) {
            department_index.push(Match(Index("grade_distribution_query_by_department"), department.toUpperCase()));
        }
        if (department_index.length > 0) { query.push(Union(...department_index)); }
    }

    if (req.query.number) {
        let number_index = []
        for (number of req.query.number.split(";")) {
            number_index.push(Match(Index("grade_distribution_query_by_number"), number.toUpperCase()));
        };
        if (number_index.length > 0) { query.push(Union(...number_index)); }
    }

    if (req.query.code) {
        let code_index = []
        for (code of req.query.code.split(";")) {
            code.match(/\d{5}/) ? code_index.push(Match(Index("grade_distribution_query_by_code"), code)) : 
            res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + code + "` in the [code] query value");
        }
        if (code_index.length > 0) { query.push(Union(...code_index)); }
    }
    
    client.query(
        Map(
            Paginate(
              Intersection(
                Match(Index("grade_distribution_all")),
                    ...query
              ), {size: 100000}
            ),
            Lambda("grade_distribution", Get(Var("grade_distribution")))
          )
    )
    .then((ret) => {
        let result = [];
        for (doc of ret.data) {
            result.push(doc.data);
        }
        result.length > 0 ? res.send(result) : res.status(404).send("No result found");
    })
    .catch((err) => res.status(400).send(err));
})

module.exports = router;
