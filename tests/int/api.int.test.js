const request = require('supertest');
const app = require('../../app');

jest.setTimeout(10000)

describe('GET /courses/all', () => {
    it('returns a json of all the courses on the catalogue',  () => request(app)
    .get('/rest/v0/courses/all')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body).toContainEqual(
            expect.objectContaining({"number": "46", "department": "I&C SCI"})
        );
    }));
});


describe('GET /courses/I&CSCI33', () => {
    it('returns a json of the specific course on the catalogue',  () => request(app)
    .get('/rest/v0/courses/I&CSCI33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body['id']).toEqual('I&C SCI 33');
        expect(response.body['title']).toEqual('Intermediate Programming');
        expect(Array.isArray(response.body['dependencies'])).toBeTruthy();
    }));
});

describe('GET /instructors/all', () => {
    it('returns a json of all instructors',  () => request(app)
    .get('/rest/v0/instructors/all')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body).toContainEqual(
            expect.objectContaining({"name": "Michael Shindler", "ucinetid": "mikes"})
        );
    }));
});

describe('GET /instructors/mikes', () => {
    it('returns a json of a specific instructor',  () => request(app)
    .get('/rest/v0/instructors/mikes')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body['name']).toEqual('Michael Shindler');
        expect(response.body['department']).toEqual('Computer Science');
        expect(Array.isArray(response.body['course_history'])).toBeTruthy();
    }));
});

// describe('GET /grades', () => {
//     it('returns a json of all the grades distribution', async () => await request(app)
//     .get('/rest/v0/grades')
//     .set('Accept', 'application/json')
//     .expect('Content-Type', /json/)
//     .expect(200)
//     .then((response) => {
//         expect(Array.isArray(response.body)).toBeTruthy();
//         expect(response.body).toContainEqual(
//             expect.objectContaining({
//                 "year": "2019-20",
//                 "instructor": "PATTIS, R.",
//                 "average_gpa": expect.number
//             })
//         );
//     }));
// });

describe('GET /grades', () => {
    it('returns a json of filtered grades distribution',  () => request(app)
    .get('/rest/v0/grades?year=2018-19;2019-20&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toEqual(expect.objectContaining({
            "year": expect.any(String),
            "instructor": "PATTIS, R.",
            "average_gpa": expect.any(Number)
        }));
    }));
});

describe('GET /grades', () => {
    it('returns a json of filtered grades distribution', () => request(app)
    .get('/rest/v0/grades?year=2017&instructor=PATTIS, R.')
    // .set('Accept', 'application/json')
    // .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        //Add more testing when error msg is done
    }));
});