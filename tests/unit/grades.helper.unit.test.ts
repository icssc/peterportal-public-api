import {
  fetchInstructors,
  parseGradesParamsToSQL,
  queryDatabaseAndResponse,
} from "../../helpers/grades.helper";
import {
  GradeCalculatedData,
  GradeRawData,
  WhereParams,
} from "../../types/types";

const expectedSQL =
  " WHERE (year = ?) AND (quarter = ?) AND (instructor = ?) AND (department = ?) AND (number = ?) AND (code = ?) AND (number_int BETWEEN 100 AND 199) AND (averageGPA != '')";
const resObj: WhereParams = {
  where: expectedSQL,
  params: ["2019-20", "SPRING", "CARVALHO, J.", "ECON", "100B", "62110"],
};

describe("Test parseGradesParamsToSQL", () => {
  it("returns SQL from grades parameters", () => {
    const rawParams = {
      instructor: "Carvalho, J.",
      year: "2019-20",
      code: "62110",
      department: "ECON",
      number: "100B",
      quarter: "SPRING",
      division: "UpperDiv",
      excludePNP: true,
    };
    const sqlParams: WhereParams = parseGradesParamsToSQL(rawParams);
    expect(sqlParams).not.toBeNull();
    expect(sqlParams).toEqual(resObj);
  });
});

describe("Test queryDatabaseAndResponse", () => {
  it("returns SQLite database response to grades query if calculated = false", () => {
    const falseRes: GradeRawData | GradeCalculatedData =
      queryDatabaseAndResponse(resObj, false);
    expect(falseRes).not.toBeNull();
    expect(falseRes).toMatchObject([
      {
        year: "2019-20",
        quarter: "SPRING",
        department: "ECON",
        department_name: "Economics",
        title: "INTER ECONOMICS II",
        number: "100B",
        code: 62110,
        section: "A",
        instructor: "CARVALHO, J.",
        type: "LEC",
        gradeACount: 143,
        gradeBCount: 93,
        gradeCCount: 11,
        gradeDCount: 1,
        gradeFCount: 0,
        gradePCount: 61,
        gradeNPCount: 5,
        gradeWCount: 0,
        averageGPA: 3.5,
      },
    ]);
  });

  it("returns SQLite database response to grades query if calculated = true", () => {
    const trueRes: GradeRawData | GradeCalculatedData =
      queryDatabaseAndResponse(resObj, true);
    expect(trueRes).not.toBeNull();
    expect(trueRes).toMatchObject({
      gradeDistribution: {
        sum_grade_a_count: 143,
        sum_grade_b_count: 93,
        sum_grade_c_count: 11,
        sum_grade_d_count: 1,
        sum_grade_f_count: 0,
        sum_grade_p_count: 61,
        sum_grade_np_count: 5,
        sum_grade_w_count: 0,
        average_gpa: 3.5,
        count: 1,
      },
      courseList: [
        {
          year: "2019-20",
          quarter: "SPRING",
          department: "ECON",
          department_name: "Economics",
          title: "INTER ECONOMICS II",
          number: "100B",
          code: 62110,
          section: "A",
          instructor: "CARVALHO, J.",
          type: "LEC",
        },
      ],
    });
  });
});

describe("Test fetchInstructors", () => {
  it("return list of instructors", () => {
    const rawParams = {
      year: "2019-20",
      department: "I&C SCI",
      number: "46",
    };
    const sqlParams: WhereParams = parseGradesParamsToSQL(rawParams);
    const instructors: string[] = fetchInstructors(sqlParams);
    expect(instructors).not.toBeNull();
    expect(Array.isArray(instructors)).toBeTruthy();
    expect(instructors).toContain("PATTIS, R.");
    expect(instructors).toContain("SHINDLER, M.");
    expect(instructors).toContain("THORNTON, A.");
  });
});
