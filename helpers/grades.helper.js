const db = require('better-sqlite3'); 
// const sqlite3 = require('sqlite3').verbose();
var path = require('path');

var {ValidationError} = require("./errors.helper")

// Constructs a WHERE clause from the query
function parseGradesParamsToSQL(query) {
    var whereClause = "";
    var paramsList = [];

    const params = {
        'year': query.year ? query.year.split(";") : null,
        'quarter': query.quarter ? query.quarter.split(";") : null,
        'instructor': query.instructor ? query.instructor.split(";") : null,
        'department': query.department ? query.department.split(";") : null,
        'number': query.number ? query.number.split(";") : null,
        'code': query.code ? query.code.split(";") : null,
        'division': query.division ? query.division: null
    }

    Object.keys(params).forEach(function(key) {
        if (key !== 'division' && params[key] !== null) {
            params[key].forEach((value) => {
                paramsList.push(value.toUpperCase());
            });
        }
        let condition = "";
        let errorMsg = (param, paramName) => `Invalid syntax found in parameters. Exception occured at '${param}' in the [${paramName}] query value`;

        switch(true) {
            case key === 'year' && params[key] !== null:
                for (year of params[key]) {
                    if (year.match(/\d{4}-\d{2}/)) {
                        condition == "" ? 
                            condition += "year = ?" :
                            condition += " OR year = ?"
                    } else {
                        throw new ValidationError(errorMsg(year, "year"))
                    }
                }
                break;
            case key === 'quarter' && params[key] !== null:
                for (quarter of params[key]) {
                    if (quarter.match(/[a-zA-Z]{4,6}/)) {
                        condition == "" ? 
                            condition += "quarter = ?" :
                            condition += " OR quarter = ?"
                    } else {
                        throw new ValidationError(errorMsg(quarter, "quarter"));
                    }
                }
                break;
            case key === 'instructor' && params[key] !== null:
                for (instructor of params[key]) {
                    if (instructor.match(/[a-zA-Z]+, [a-zA-Z]\./)) {
                        condition == "" ? 
                            condition += "instructor = ?" :
                            condition += " OR instructor = ?"
                    } else {
                        throw new ValidationError(errorMsg(instructor, "instructor"));
                    }
                }
                break;
            case key === 'department' && params[key] !== null:
                for (department of params[key]) {
                    // TODO: Implement UCI Dept code param validation
                    condition == "" ? 
                        condition += "department = ?" :
                        condition += " OR department = ?"
                }
                break;
            case key === 'number' && params[key] !== null:
                for (number of params[key]) {
                    condition == "" ? 
                        condition += "number = ?" :
                        condition += " OR number = ?"
                }
                break;
            case key === 'code' && params[key] !== null:
                for (code of params[key]) {
                    if (code.match(/\d{5}/)) {
                        condition == "" ? 
                            condition += "code = ?" :
                            condition += " OR code = ?"
                    } else {
                        throw new ValidationError(errorMsg(code, "code"));
                    }
                }
                break;
            case key == 'division' && params[key] !== null:
                let division = params[key].toLowerCase();
                if (division == "lowerdiv") {
                    condition == "" ? 
                        condition += "number_int < 100" : 
                        condition += " OR number_int < 100" 
                } else if (division == "upperdiv") {
                    condition == "" ? 
                        condition += "number_int BETWEEN 100 AND 199" : 
                        condition += " OR number_int BETWEEN 100 AND 199" 
                } else {
                    throw new ValidationError(errorMsg(params[key], "division"))
                }

        }
        
        whereClause === "" ?  
            (condition.length > 0 ? whereClause += "(" + condition + ")" : null) : 
            (condition.length > 0 ? whereClause += " AND " + "(" + condition + ")" : null)
    })

    var whereString = whereClause === "" ? null : " WHERE " + whereClause;
    whereString = (query.excludePNP && whereString !== null) ? whereString += "AND (averageGPA != '')" : whereString;

    var retVal = {
        "where": whereString,
        "params": paramsList
    }
    return retVal;
}

function fetchGrades(where) {
    let sqlStatement = "SELECT * FROM gradeDistribution";
    return queryDatabase(where.where !== null ? sqlStatement + where.where : sqlStatement).bind(where.params).all();
}

function fetchInstructors(where) {
    let sqlStatement = "SELECT DISTINCT instructor FROM gradeDistribution";
    return queryDatabase(where.where !== null ? sqlStatement + where.where : sqlStatement).bind(where.params).all().map(result => result.instructor);
}

//For GraphQL API
function fetchAggregatedGrades(where) {
    let sqlStatement = `SELECT 
    SUM(gradeACount) as sum_grade_a_count, 
    SUM(gradeBCount) as sum_grade_b_count, 
    SUM(gradeCCount) as sum_grade_c_count,
    SUM(gradeDCount) as sum_grade_d_count,
    SUM(gradeFCount) as sum_grade_f_count,
    SUM(gradePCount) as sum_grade_p_count,
    SUM(gradeNPCount) as sum_grade_np_count,
    SUM(gradeWCount) as sum_grade_w_count,
    AVG(NULLIF(averageGPA, '')) as average_gpa,
    COUNT() as count FROM gradeDistribution`;
    
    return queryDatabase(where.where != null ? sqlStatement + where.where : sqlStatement).bind(where.params).get();
}

function queryDatabase(statement) {
    const connection = new db(path.join(__dirname, '../db/db.sqlite'));
    return connection.prepare(statement)
}

//For REST API 
function queryDatabaseAndResponse(where, calculate) {
    const connection = new db(path.join(__dirname, '../db/db.sqlite'));
    switch (calculate) {
        case true:
            let result = {
                gradeDistribution: null,
                courseList: []
            };

            let sqlFunction = `SELECT 
            SUM(gradeACount) as sum_grade_a_count, 
            SUM(gradeBCount) as sum_grade_b_count, 
            SUM(gradeCCount) as sum_grade_c_count,
            SUM(gradeDCount) as sum_grade_d_count,
            SUM(gradeFCount) as sum_grade_f_count,
            SUM(gradePCount) as sum_grade_p_count,
            SUM(gradeNPCount) as sum_grade_np_count,
            SUM(gradeWCount) as sum_grade_w_count,
            AVG(NULLIF(averageGPA, '')) as average_gpa,
            COUNT() as count FROM gradeDistribution`;
        
            let sqlCourseList = `SELECT 
            year, 
            quarter, 
            department,
            department_name,
            number,
            code,
            section,
            title,
            instructor,
            type FROM gradeDistribution`;

            result.gradeDistribution = connection.prepare(where.where !== null ? sqlFunction + where.where : sqlFunction).bind(where.params).get();

            result.courseList = connection.prepare(where.where !== null ? sqlCourseList + where.where : sqlCourseList).bind(where.params).all();

            return result;
        case false:
            let sqlQueryAll = "SELECT * FROM gradeDistribution";
            const queryResult = connection.prepare(where.where !== null ? sqlQueryAll + where.where : sqlQueryAll).bind(where.params).all();

            return queryResult;
    }

    // Close connection when done
    connection.close()

}

module.exports = {parseGradesParamsToSQL, queryDatabaseAndResponse, fetchGrades, fetchAggregatedGrades, fetchInstructors}