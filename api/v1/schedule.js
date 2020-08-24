var express = require("express");
var router = express.Router();
var getWeek = require("./week");
var ScheduleParser = require("./schedule-parser.js");
const WebSocAPI = require("websoc-api");

const TERM_SEASONS = ['Winter', 'Spring', 'Summer1','Summer10wk', 'Summer2',  'Fall']

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Schedule Queries
 */

// term: school year + season (eg. "2020 Spring")
// id: the courseID with no spaces (eg. "COMPSCI143A")
// returns schedule information for a course 
router.get("/:term/:id", function (req, res, next) {
  getCourse(req.params.id, function (err, data) {
    const opts = {
      term: req.params.term,
      department: data["id_department"],
      courseNumber: data["id_number"]
    };

    WebSocAPI.callWebSocAPI(opts).then(json => res.json(
      {
        term: req.params.term,
        course: data["id"],
        name: data["name"],
        sessions: ScheduleParser.ParsedSectionsByDay(json)
      }));
  });
});

/**
 * @swagger
 * path:
 *  /schedule/getTerms:
 *    get:
 *      summary: Gets the terms for the current and past years
 *      tags: [Schedule]
 *      parameters:
 *        - in: query
 *          name: pastYears
 *          required: false
 *          schema:
 *            type: integer
 *            example: 3
 *            default: 1
 *            description: How many years to go in the past.
 *      responses:
 *        "200":
 *          description: A list of valid terms
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: string
 *                  example: "2020 Fall"
 *                  description: A valid term for the Fall season of the year 2020.
 */
router.get("/getTerms", function(req, res){
  let pastYears = req.query.pastYears;
  res.json(getTerms(pastYears));
})

function getTerms(pastYears){
  if(!pastYears)
  pastYears = 1;
  let d = new Date();
  let year = d.getFullYear();
  terms = [];
  for(let y = year - pastYears; y <= year; ++y){
      for(let i = 0; i < TERM_SEASONS.length; ++i){
          terms.push(`${y} ${TERM_SEASONS[i]}`);
      }
  }
  return terms
}

/**
 * @swagger
 * path:
 *  /schedule/getWeek:
 *    get:
 *      summary: Gets the current week in the quarter
 *      tags: [Schedule]
 *      responses:
 *        "200":
 *          description: A description of the current week
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example: "Week 3, Spring 2020"
 */
router.get("/getWeek", getWeek)

module.exports = {scheduleRouter: router, getTerms: getTerms};