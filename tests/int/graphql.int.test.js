const supertest = require('./api.int.test');
const request = supertest.request;
jest.setTimeout(10000)


// Courses
describe('POST /graphql/', () => {
    it('GraphQL: Course Query on COMPSCI161',  () => request
    .post('/graphql/')
    .send({query:"{\n  course(id:\"COMPSCI161\") {\n    id,\n    department,\n    number,\n  }\n}"})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('course');
        expect(response.body["data"]["course"]).toEqual(
            expect.objectContaining({"number": "161", "department": "COMPSCI", "id": "COMPSCI161"})
        );
        expect(response.body["data"]["course"]).not.toHaveProperty('description');
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
        course(id:"COMPSCI1621){
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
    it('GraphQL: Nested Course Objects',  () => request
    .post('/graphql/')
    .send({query:"{\n  course(id:\"COMPSCI161\") {\n    id,\n    prerequisite_for {id, title},\n }\n}"})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('course');
        expect(response.body["data"]["course"]).not.toHaveProperty('description');
        expect(Array.isArray(response.body["data"]["course"]["prerequisite_for"])).toBeTruthy();
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
    it('returns a json of all the courses on the catalogue',  () => request
    .post('/graphql/')
    .send({query:"{\n  allCourses {\n    id,\n    description,\n    number,\n  }\n}"})
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
    it('GraphQL: Instructor Query on pattis',  () => request
    .post('/graphql/')
    .send({query:`{
        instructor(ucinetid:"pattis"){
          ucinetid
          department
          name
          title
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('instructor');
        expect(response.body["data"]["instructor"]).toEqual(
            expect.objectContaining({
                "department": "Computer Science",
                "name": "Richard Eric Pattis"})
        );
        expect(response.body["data"]["instructor"]).not.toHaveProperty('description');
    }));
});


describe('POST /graphql/', () => {
    it('returns a json of all the courses on the catalogue',  () => request
    .post('/graphql/')
    .send({query:`{
        instructor(ucinetid:"pattis"){
          ucinetid
          course_history {
              id
              department
          }
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('instructor');
        expect(response.body["data"]["instructor"]).not.toHaveProperty('description');
        expect(Array.isArray(response.body["data"]["instructor"]["course_history"])).toBeTruthy();
        expect(response.body["data"]["instructor"]["course_history"]).toEqual(
            expect.arrayContaining([  
                expect.objectContaining({
                    "id": "I&CSCI33",
                    "department": "I&C SCI"
                })
            ])
        );
    }));
});


describe('POST /graphql/', () => {
    it('returns a json of all the courses on the catalogue',  () => request
    .post('/graphql/')
    .send({query:`{
        allInstructors{
          ucinetid
          name
          course_history {
              id
              department
          }
        }
      }`})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('data');
        expect(response.body["data"]).toHaveProperty('allInstructors');
        expect(Array.isArray(response.body["data"]["allInstructors"])).toBeTruthy();
        expect(response.body["data"]["allInstructors"]).toEqual(
            expect.arrayContaining([  
                expect.objectContaining({
                "ucinetid": "kakagi",
                "name": "Kei Akagi"
            })])
        );
        expect(response.body["data"]["allInstructors"][0]).toHaveProperty('ucinetid');
        expect(response.body["data"]["allInstructors"][0]).toHaveProperty('name');
        expect(response.body["data"]["allInstructors"][0]).toHaveProperty('course_history');
        expect(Array.isArray(response.body["data"]["allInstructors"][0]['course_history']));
    }));
});

// describe('POST /graphql/', () => {
//     it('returns a json of all the courses on the catalogue',  () => request
//     .post('/graphql/')
//     .send({query:"{\n  course(id:\"COMPSCI161\") {\n    id,\n    prerequisite_for {id, title},\n }\n}"})
//     .set('Accept', 'application/json')
//     .expect('Content-Type', /json/)
//     .expect(200)
//     .then((response) => {
//         expect(response.body).toHaveProperty('data');
//         expect(response.body["data"]).toHaveProperty('course');
//         expect(response.body["data"]["course"]).not.toHaveProperty('description');
//         expect(Array.isArray(response.body["data"]["course"]["prerequisite_for"])).toBeTruthy();
//         expect(response.body["data"]["course"]["prerequisite_for"]).toEqual(
//             expect.arrayContaining([  
//                 expect.objectContaining({
//                     "id": "COMPSCI163",
//                     "title": "Graph  Algorithms"
//                 })
//             ])
//         );
        
//     }));
// });

describe('POST /graphql/', () => {
    it('returns a json of all the courses on the catalogue',  () => request
    .post('/graphql/')
    .send({query:"{\n  allCourses {\n    id,\n    description,\n    number,\n  }\n}"})
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


