const supertest = require('../api.int.test');
const request = supertest.request;
jest.setTimeout(10000)


// Courses
describe('POST /graphql/', () => {
    it('GraphQL: Course Query on COMPSCI161(All Fields)',  () => request
    .post('/graphql/')
    .send({query:`{
        course(id:"COMPSCI161") {
          id
          department
          number
          school
          title
          course_level
          department_alias
          units
          description
          department_name
          instructor_history {
            ucinetid
            name
            title
          }
          prerequisite_tree
          prerequisite_list {
            department
            number
            title
          }
          prerequisite_text
          prerequisite_for {
            id
            department
            number
            title
          }
          repeatability 
          concurrent
          same_as
          restriction
          overlap
          corequisite
          ge_list
          ge_text
          terms
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('course');
        expect(response.body["data"]["course"]).toEqual(
            expect.objectContaining({"number": "161", "department": "COMPSCI", "id": "COMPSCI161"})
        );
        expect(Array.isArray(response.body["data"]["course"]["prerequisite_for"])).toBeTruthy();
        expect(Array.isArray(response.body["data"]["course"]["prerequisite_list"])).toBeTruthy();
        expect(response.body["data"]["course"]["prerequisite_list"].length > 0).toBeTruthy();
        expect(response.body["data"]["course"]["prerequisite_for"]).toEqual(
            expect.arrayContaining([  
                expect.objectContaining({
                    "id": "COMPSCI163",
                    "title": "Graph  Algorithms"
                })
            ])
        );
    }));
});

describe('POST /graphql/', () => {
    it('GraphQL: Course Query on nonexistent course',  () => request
    .post('/graphql/')
    .send({query:`query {
        course(id:"COMPSCI1621"){
          id
          department
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('course');
        expect(response.body["data"]["course"]).toBeNull();
    }));
});

describe('POST /graphql/', () => {
    it('GraphQL: Nonexistent field',  () => request
    .post('/graphql/')
    .send({query:`query {
        course(id:"COMPSCI121"){
          id
          nonexistent
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        expect(response.body).toHaveProperty('errors');
    }));
});

describe('POST /graphql/', () => {
  it('GraphQL: Incorrect argument',  () => request
  .post('/graphql/')
  .send({query:`query {
      course(name:"COMPSCI121"){
        id
        department
        title
      }
    }`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(400)
  .then((response) => {
      expect(response.body).toHaveProperty('errors');
  }));
});

describe('POST /graphql/', () => {
    it('GraphQL: Syntax Error: Missing quotation mark',  () => request
    .post('/graphql/')
    .send({query:`query {
        course(id:"COMPSCI1621){
          id
          department
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        expect(response.body).toHaveProperty('errors');
    }));
});

describe('POST /graphql/', () => {
    it('GraphQL: allCourses',  () => request
    .post('/graphql/')
    .send({query:`query {
        allCourses {
              id,
              description,
              number,
            }
        }`
      })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('allCourses');
        expect(Array.isArray(response.body["data"]["allCourses"])).toBeTruthy();
        expect(response.body["data"]["allCourses"]).toEqual(
            expect.arrayContaining([  
                expect.objectContaining({
                "id": "CHINESE2A",
                "number": "2A"
            })])
        );
        expect(response.body["data"]["allCourses"][0]).toHaveProperty('id');
        expect(response.body["data"]["allCourses"][0]).toHaveProperty('description');
        expect(response.body["data"]["allCourses"][0]).toHaveProperty('number');
    }));
});


describe('POST /graphql/', () => {
  it('GraphQL: allCourses Error: Nested course offerings in allCourses',  () => request
  .post('/graphql/')
  .send({query:`query {
      allCourses {
        id
        offerings {
          status
        }
      }
    }`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .then((response) => {
      expect(response.body).toHaveProperty('errors');
      expect(response.body["errors"][0]["path"]).toEqual(expect.arrayContaining(["offerings"]));
  }));
});