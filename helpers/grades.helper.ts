import db, { Database } from "better-sqlite3";
import path from 'path';
import { ValidationError } from "./errors.helper";
import { GradeDistAggregate, GradeCalculatedData, GradeRawData, WhereParams} from "../types/types"

// Constructs a WHERE clause from the query
export function parseGradesParamsToSQL(query: {[key: string]: any;}) : WhereParams{
    let whereClause = "";
    var paramsList: string[] = [];

    const params : { [key: string]: any; } = {
        'year': query.year ? query.year.split(";") : null,
        'quarter': query.quarter ? query.quarter.split(";") : null,
        'instructor': query.instructor ? query.instructor.split(";") : null,
        'department': query.department ? query.department.split(";") : null,
        'number': query.number ? query.number.split(";") : null,
        'code': query.code ? query.code.split(";") : null,
        'division': query.division ? query.division: null
    }

    Object.keys(params).forEach(function(key) {
        if (Array.isArray(params[key]) && params[key] !== null) {
            params[key].forEach((value: string) => {
                paramsList.push(value.toUpperCase());
            });
        }
        let condition = "";
        let errorMsg = (param: string, paramName: string) => `Invalid syntax found in parameters. Exception occured at '${param}' in the [${paramName}] query value`;

        switch(true) {
            case key === 'year' && params[key] !== null:
                for (let year of params[key]) {
                    if (year.match(/^\d{4}-\d{2}$/)) {
                        condition == "" ? 
                            condition += "year = ?" :
                            condition += " OR year = ?"
                    } else {
                        throw new ValidationError(errorMsg(year, "year"))
                    }
                }
                break;
            case key === 'quarter' && params[key] !== null:
                for (let quarter of params[key]) {
                    if (quarter.match(/^[a-zA-Z]{4,6}$/)) {
                        condition == "" ? 
                            condition += "quarter = ?" :
                            condition += " OR quarter = ?"
                    } else {
                        throw new ValidationError(errorMsg(quarter, "quarter"));
                    }
                }
                break;
            case key === 'instructor' && params[key] !== null:
                for (let instructor of params[key]) {
                    if (instructor.match(/^[a-zA-Z\-]+, [a-zA-Z]\.$/)) {
                        condition == "" ? 
                            condition += "instructor = ?" :
                            condition += " OR instructor = ?"
                    } else {
                        throw new ValidationError(errorMsg(instructor, "instructor"));
                    }
                }
                break;
            case key === 'department' && params[key] !== null:
                for (let department of params[key]) {
                    // TODO: Implement UCI Dept code param validation
                    condition == "" ? 
                        condition += "department = ?" :
                        condition += " OR department = ?"
                }
                break;
            case key === 'number' && params[key] !== null:
                for (let number of params[key]) {
                    condition == "" ? 
                        condition += "number = ?" :
                        condition += " OR number = ?"
                }
                break;
            case key === 'code' && params[key] !== null:
                for (let code of params[key]) {
                    if (code.match(/^\d{5}$/)) {
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
    });

    let whereString = whereClause === "" ? "" : " WHERE " + whereClause;
    whereString += query.excludePNP ? 
        (whereString !== "" ? " AND (averageGPA != '')" : " WHERE (averageGPA != '')") : ""

    let retVal: WhereParams = {
        "where": whereString,
        "params": paramsList
    }
    return retVal;
}

function queryDatabase(statement: string, connection?: Database) {
    if (!connection) {
        connection = new db(path.join(__dirname, '../db/db.sqlite'));
    }
    return connection.prepare(statement)
}

export function fetchGrades(where: WhereParams) : GradeRawData {
    let sqlStatement = `SELECT 
    year, 
    quarter, 
    department, 
    department_name,
    number, 
    number_int,
    code, 
    section, 
    title, 
    instructor, 
    type, 
    gradeACount, 
    gradeBCount,
    gradeCCount,
    gradeDCount,
    gradeFCount,
    gradePCount,
    gradeNPCount,
    gradeWCount,
    NULLIF(averageGPA, '') as averageGPA FROM gradeDistribution`;
    return queryDatabase(where.where != null ? sqlStatement + where.where : sqlStatement).bind(where.params).all();
    
}


export function fetchInstructors(where: WhereParams) : string[] {
    let sqlStatement = "SELECT DISTINCT instructor FROM gradeDistribution";
    return queryDatabase(where.where != null ? sqlStatement + where.where : sqlStatement).bind(where.params).all().map(result => result.instructor);
}

//For GraphQL API
export function fetchAggregatedGrades(where: WhereParams) : GradeDistAggregate {
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

export function fetchCalculatedData(where: WhereParams) : GradeCalculatedData {

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
    let gradeDistribution = connection.prepare(where.where != null ? sqlFunction + where.where : sqlFunction).bind(where.params).get();
    let courseList = connection.prepare(where.where != null ? sqlCourseList + where.where : sqlCourseList).bind(where.params).all();
    connection.close();
    return { gradeDistribution, courseList };
}

//For REST API 
export function queryDatabaseAndResponse(where: WhereParams, calculate: boolean) : GradeRawData | GradeCalculatedData {
    return calculate ? fetchCalculatedData(where) : fetchGrades(where);
}

