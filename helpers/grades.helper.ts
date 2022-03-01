import db, { Database } from "better-sqlite3";
import path from 'path';
import { ValidationError } from "./errors.helper";
import { GradeDist, GradeCalculatedData, GradeRawData} from "../types/types"

// Constructs a WHERE clause from the query
export function parseGradesParamsToSQL(query) : string{
    let whereClause = "";

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
        let condition = "";
        let errorMsg = (param, paramName) => `Invalid syntax found in parameters. Exception occured at '${param}' in the [${paramName}] query value`;

        switch(true) {
            case key === 'year' && params[key] !== null:
                for (let year of params[key]) {
                    if (year.match(/^\d{4}-\d{2}$/)) {
                        condition == "" ? 
                            condition += "year = '" + year + "'" : 
                            condition += " OR year = '" + year + "'" 
                    } else {
                        throw new ValidationError(errorMsg(year, "year"))
                    }
                }
                break;
            case key === 'quarter' && params[key] !== null:
                for (let quarter of params[key]) {
                    if (quarter.match(/^[a-zA-Z]{4,6}$/)) {
                        condition == "" ? 
                            condition += "quarter = '" + quarter.toUpperCase() + "'" : 
                            condition += " OR quarter = '" + quarter.toUpperCase() + "'"
                    } else {
                        throw new ValidationError(errorMsg(quarter, "quarter"));
                    }
                }
                break;
            case key === 'instructor' && params[key] !== null:
                for (let instructor of params[key]) {
                    if (instructor.match(/^[a-zA-Z]+, [a-zA-Z]\.$/)) {
                        condition == "" ? 
                            condition += "instructor = '" + instructor.toUpperCase() + "'" : 
                            condition += " OR instructor = '" + instructor.toUpperCase() + "'" 
                    } else {
                        throw new ValidationError(errorMsg(instructor, "instructor"));
                    }
                }
                break;
            case key === 'department' && params[key] !== null:
                for (let department of params[key]) {
                    // TODO: Implement UCI Dept code param validation
                    condition == "" ? 
                        condition += "department = '" + department.toUpperCase() + "'" : 
                        condition += " OR department = '" + department.toUpperCase() + "'"
                }
                break;
            case key === 'number' && params[key] !== null:
                for (let number of params[key]) {
                    condition == "" ? 
                        condition += "number = '" + number.toUpperCase() + "'" : 
                        condition += " OR number = '" + number.toUpperCase() + "'"
                }
                break;
            case key === 'code' && params[key] !== null:
                for (let code of params[key]) {
                    if (code.match(/^\d{5}$/)) {
                        condition == "" ? 
                            condition += "code = '" + code.toUpperCase() + "'" : 
                            condition += " OR code = '" + code.toUpperCase() + "'" 
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
    });
    
    let retVal = whereClause === "" ? null : " WHERE " + whereClause;
    retVal = (query.excludePNP && retVal !== null) ? retVal += ` AND (averageGPA != '')` : retVal
    return retVal;
}

export function fetchGrades(where: string) : GradeRawData {
    let sqlStatement = "SELECT * FROM gradeDistribution";
    return queryDatabase(where !== null ? sqlStatement + where : sqlStatement).all();
}

export function fetchInstructors(where: string) : string[] {
    let sqlStatement = "SELECT DISTINCT instructor FROM gradeDistribution";
    return queryDatabase(where !== null ? sqlStatement + where : sqlStatement).all().map(result => result.instructor);
}

//For GraphQL API
export function fetchAggregatedGrades(where: string) : GradeDist {
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
    
    return queryDatabase(where != null ? sqlStatement + where : sqlStatement).get();
}

function queryDatabase(statement: string, connection?: Database) {
    if (!connection) {
        connection = new db(path.join(__dirname, '../db/db.sqlite'));
    }
    return connection.prepare(statement)
}

export function fetchCalculatedData(where) : GradeCalculatedData{

    let result : GradeCalculatedData = {
        gradeDistribution : null,
        courseList : []
    };
    const connection : Database = new db(path.join(__dirname, '../db/db.sqlite'));

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

    result.gradeDistribution = queryDatabase(where !== null ? sqlFunction + where : sqlFunction, connection).get();
    result.courseList = queryDatabase(where !== null ? sqlCourseList + where : sqlCourseList, connection).all();
    connection.close();
    return result;
}

//For REST API 
export function queryDatabaseAndResponse(where: string, calculate: boolean) : GradeRawData | GradeCalculatedData {
    return calculate ? fetchCalculatedData(where) : fetchGrades(where);
}
