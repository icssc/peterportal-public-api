const db = require('better-sqlite3'); 
var path = require('path');


function parseGradesParamsToSQL(req) {
    var whereClause = "";

    const params = {
        'year': req.query.year ? req.query.year.split(";") : null,
        'quarter': req.query.quarter ? req.query.quarter.split(";") : null,
        'instructor': req.query.instructor ? req.query.instructor.split(";") : null,
        'department': req.query.department ? req.query.department.split(";") : null,
        'number': req.query.number ? req.query.number.split(";") : null,
        'code': req.query.code ? req.query.code.split(";") : null
    }

    Object.keys(params).forEach(function(key) {
        let condition = "";

        switch(true) {
            case key === 'year' && params[key] !== null:
                for (year of params[key]) {
                    year.match(/\d{4}-\d{2}/) ? 
                        (condition == "" ? 
                            condition += "year = '" + year + "'" : 
                            condition += " OR year = '" + year + "'") 
                    : 
                    res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + year + "` in the [year] query value");
                }
                break;
            case key === 'quarter' && params[key] !== null:
                for (quarter of params[key]) {
                    quarter.match(/[a-zA-Z]{4,6}/) ? 
                    (condition == "" ? 
                        condition += "quarter = '" + quarter.toUpperCase() + "'" : 
                        condition += " OR quarter = '" + quarter.toUpperCase() + "'") 
                    : 
                    res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + quarter + "` in the [quarter] query value");
                }
                break;
            case key === 'instructor' && params[key] !== null:
                for (instructor of params[key]) {
                    instructor.match(/[a-zA-Z]+, [a-zA-Z]\./) ? 
                    (condition == "" ? 
                        condition += "instructor = '" + instructor.toUpperCase() + "'" : 
                        condition += " OR instructor = '" + instructor.toUpperCase() + "'") 
                    : 
                    res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + instructor + "` in the [instructor] query value");
                }
                break;
            case key === 'department' && params[key] !== null:
                for (department of params[key]) {
                    // TODO: Implement UCI Dept code param validation
                    condition == "" ? 
                        condition += "department = '" + department.toUpperCase() + "'" : 
                        condition += " OR department = '" + department.toUpperCase() + "'"
                }
                break;
            case key === 'number' && params[key] !== null:
                for (number of params[key]) {
                    condition == "" ? 
                        condition += "number = '" + number.toUpperCase() + "'" : 
                        condition += " OR number = '" + number.toUpperCase() + "'"
                }
                break;
            case key === 'code' && params[key] !== null:
                for (code of params[key]) {
                    code.match(/\d{5}/) ? 
                    (condition == "" ? 
                        condition += "code = '" + code.toUpperCase() + "'" : 
                        condition += " OR code = '" + code.toUpperCase() + "'") 
                    : 
                    res.status(400).send("The server could not understand the request due to invalid syntax. Expection occured at `" + code + "` in the [code] query value");
                }
                break;
        }
        
        whereClause === "" ?  
            (condition.length > 0 ? whereClause += "(" + condition + ")" : null) : 
            (condition.length > 0 ? whereClause += " AND (" + condition + ")" : null)
    })

    // console.log(params);
    
    return whereClause === "" ? null : " WHERE " + whereClause;
}

function queryDatabaseAndResponse(where, calculate, res) {
    const connection = new db(path.join(__dirname, '../../db/db.sqlite'));

    switch (calculate) {
        case true:
            let result = {
                gradeDistribution: null,
                courseList: []
            };

            let sqlFunction = `SELECT 
                                SUM(gradeACount), 
                                SUM(gradeBCount), 
                                SUM(gradeCCount),
                                SUM(gradeDCount),
                                SUM(gradeFCount),
                                SUM(gradePCount),
                                SUM(gradeNPCount),
                                SUM(gradeWCount),
                                AVG(averageGPA),
                                COUNT() FROM gradeDistribution`;
            
            let sqlCourseList = `SELECT 
                                year, 
                                quarter, 
                                department,
                                number,
                                code,
                                section,
                                instructor,
                                type FROM gradeDistribution`;

            result.gradeDistribution = connection.prepare(where !== null ? sqlFunction + where : sqlFunction).get();

            result.courseList = connection.prepare(where !== null ? sqlCourseList + where : sqlCourseList).all();

            res.send(result);

            break;
        case false:
            let sqlQueryAll = "SELECT * FROM gradeDistribution";

            res.send(connection.prepare(where !== null ? sqlQueryAll + where : sqlQueryAll).all());

            break;
    }

}

module.exports = {parseGradesParamsToSQL, queryDatabaseAndResponse}