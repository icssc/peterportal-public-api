const supertest = require('../api.int.test');
const request = supertest.request;
jest.setTimeout(10000)

// Instructors
describe('POST /graphql/', () => {
  it('GraphQL: Instructor Query on pattis(all fields)',  () => request
  .post('/graphql/')
  .send({query:`{
      instructor(ucinetid:"pattis") {
        name
        ucinetid
        title
        department
        schools
        related_departments
        course_history {
          id
          title
          department
          number
        }
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
      expect(Array.isArray(response.body["data"]["instructor"]["course_history"])).toBeTruthy();
      expect(Array.isArray(response.body["data"]["instructor"]["schools"])).toBeTruthy();
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
  it('GraphQL: Instructor query on nonexistent instructor',  () => request
  .post('/graphql/')
  .send({query:`{
      instructor(ucinetid:"johndoe"){
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
      expect(response.body["data"]["instructor"]).toBeNull();
  }));
});

describe('POST /graphql/', () => {
  it('GraphQL: Instructor query for nested offerings', () => request
  .post('/graphql/')
  .send({query:`{
      professor(ucinetid:"pattis") {
        course_history {
          offerings {
            final_exam
          }
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

describe('POST /graphql/', () => {
  it('GraphQL: Incorrect argument',  () => request
  .post('/graphql/')
  .send({query:`query {
      instructor(name:"pattis"){
        ucinetid
        department
        title
      }
    }`})
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(400)
  .then((response) => {
      expect(response.body).toHaveProperty('errors');
      expect(response.body["errors"][0]["message"]).toMatch(/(argument)/i);
  }));
});

describe('POST /graphql/', () => {
  it('GraphQL: All Instructors query',  () => request
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



