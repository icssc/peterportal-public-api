import request from '../api.int.helper';

jest.setTimeout(30000)

// Grades
describe('POST /graphql/', () => {
  it('GraphQL: Grades Query on I&C SCI 33',  () => request
  .post('/graphql/')
  .send({query:`{
        grades(year:"2019-20", department: "I&C SCI", number:"33") {
            aggregate {
                sum_grade_a_count
                sum_grade_b_count
                sum_grade_c_count
                sum_grade_d_count
                sum_grade_f_count
                sum_grade_f_count
                sum_grade_p_count
                sum_grade_w_count
                average_gpa
            }
            grade_distributions {
                grade_a_count
                grade_b_count
                grade_c_count
                grade_d_count
                grade_f_count
                grade_p_count
                grade_w_count
                grade_np_count
                average_gpa
                course_offering {
                  year
                  quarter
                  final_exam
                  instructors {
                    ucinetid
                    name
                    department
                  }
                  max_capacity
                  meetings {
                    building
                    days
                    time
                  }
                  section {
                    code
                    comment
                    number
                    type
                  }
                  course {
                      id
                      department
                      number
                  }
              }
            }
            instructors
        }
    }`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then((response) => {
      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body["data"]).toHaveProperty('grades');
      expect(response.body["data"]["grades"]["aggregate"]).toEqual(
          expect.objectContaining({
              "sum_grade_a_count": expect.any(Number),
              "sum_grade_b_count": expect.any(Number),
              "average_gpa": expect.any(Number)})
      );
      expect(response.body["data"]["grades"]["aggregate"]["average_gpa"]).toBeLessThanOrEqual(4.0);
      expect(Array.isArray(response.body["data"]["grades"]["grade_distributions"])).toBeTruthy();
      expect(response.body["data"]["grades"]["grade_distributions"][0]).toEqual(
        expect.objectContaining({
            "grade_a_count": expect.any(Number),
            "grade_b_count": expect.any(Number),
            "average_gpa": expect.any(Number)
        })
      );
      expect(response.body["data"]["grades"]["grade_distributions"][0]["average_gpa"]).toBeLessThanOrEqual(4.0);
      expect(response.body["data"]["grades"]["grade_distributions"][0]["course_offering"]).toEqual(
          expect.objectContaining({
              "year": "2019-20",
              "quarter": expect.any(String),
              "section": expect.any(Object)
          })
      );
      expect(response.body["data"]["grades"]["grade_distributions"][0]["course_offering"]["course"]).toEqual(
        expect.objectContaining({
            "department": "I&C SCI",
            "number": "33",
        })
      );
      expect(Array.isArray(response.body["data"]["grades"]["instructors"])).toBeTruthy();
  }));
});


describe('POST /graphql/', () => {
  it('GraphQL: Grades Query, multiple years',  () => request
  .post('/graphql/')
  .send({query:`{
    grades(year:"2019-20;2018-19", department: "I&C SCI") {
        grade_distributions {
          course_offering {
            year
            quarter
            section {
              code
            }
            course {
              id
            }
          }
        }
    }
}`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then((response) => {
      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body["data"]).toHaveProperty('grades');
      response.body["data"]["grades"]["grade_distributions"].forEach( grade_dist => {
          let year = grade_dist["course_offering"]["year"];
          expect(year == "2019-20" || year == "2018-19").toBeTruthy();
      });
  }));
});

describe('POST /graphql/', () => {
  it('GraphQL: Grades Query, nonexistent argument value',  () => request
  .post('/graphql/')
  .send({query:`{
    grades(year:"2019-20;2018-19", department: "FAKE_DEPARTMENT") {
      aggregate {
        sum_grade_a_count
        average_gpa
      }
        grade_distributions {
          course_offering {
            year
            section {
              code
            }
            course {
              id
            }
          }
        }
    }
}`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then((response) => {
      expect(response.body).toHaveProperty('data');
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body["data"]).toHaveProperty('grades');
      expect(response.body["data"]["grades"]["aggregate"]["average_gpa"]).toBeNull();
      expect(response.body["data"]["grades"]["grade_distributions"].length).toEqual(0);
  }));
});

describe('POST /graphql/', () => {
  it('GraphQL: Grades Query, nonexistent argument variable',  () => request
  .post('/graphql/')
  .send({query:`{
    grades(year:"2019-20;2018-19", dept:"COMPSCI") {
      aggregate {
        sum_grade_a_count
        average_gpa
      }
        grade_distributions {
          course_offering {
            year
            section {
              code
            }
            course {
              id
            }
          }
        }
    }
}`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(400)
  .then((response) => {
      expect(response.body).toHaveProperty('errors');
      expect(response.body["errors"].length).toBeGreaterThan(0);
      expect(response.body["errors"][0].message).toMatch(/(argument)/i);
  }));
});


describe('POST /graphql/', () => {
  it('GraphQL: Grades Query, all grades instructors',  () => request
  .post('/graphql/')
  .send({query:`{
    grades {
      grade_distributions {
        course_offering {
          instructors {
            shortened_name
            name
          }
        }
      }
    }
  }`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then((response) => {
      console.log(response.body);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body).toHaveProperty("data");
      expect(response.body["data"]).toHaveProperty('grades');
      expect(response.body["data"]["grades"]["grade_distributions"].length).toBeGreaterThan(0);
  }));
});