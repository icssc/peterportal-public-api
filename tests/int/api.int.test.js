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
        expect(response.body['id']).toEqual('I&CSCI33');
        expect(response.body['title']).toEqual('Intermediate Programming');
        expect(Array.isArray(response.body['dependencies'])).toBeTruthy();
    }));
});

describe('GET /courses/I&CSCI0000000', () => {
    it('returns an error message for a course that does not exist',  () => request(app)
    .get('/rest/v0/courses/I&CSCI0000000')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404)
    .then((response) => {
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body['status']).toEqual(404);
        expect(response.body['error']).toEqual("Bad Request: Invalid parameter");
        expect(response.body['message']).toEqual("Course not found");
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

describe('GET /instructors/randomguy', () => {
    it('returns an error for instructor that does not exist',  () => request(app)
    .get('/rest/v0/instructors/randomguy')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404)
    .then((response) => {
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body['status']).toEqual(404);
        expect(response.body['error']).toEqual("Bad Request: Invalid parameter");
        expect(response.body['message']).toEqual("Instructor not found");
    }));
});

describe('GET /grades/calculated', () => {
    it('returns a json of all the grades distribution', async () => await request(app)
    .get('/rest/v0/grades/calculated')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('gradeDistribution')
        expect(Array.isArray(response.body['courseList'])).toBeTruthy();
        expect(response.body['courseList'].length).toBeGreaterThan(0);
    }));
});

describe('GET /grades/calculated', () => {
    it('returns a json of filtered grades distribution',  () => request(app)
    .get('/rest/v0/grades/calculated?year=2018-19;2019-20&instructor=PATTIS R.&department=I%26C SCI&quarter=Fall&number=33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('gradeDistribution')
        expect(Array.isArray(response.body['courseList'])).toBeTruthy();
        expect(response.body['courseList'].length).toBeGreaterThan(0);
        expect(response.body['courseList'][0]).toEqual(expect.objectContaining({
            "year": expect.any(String),
            "instructor": "PATTIS R.",
            "code": expect.any(Number)
        }));
    }));
});

describe('GET /grades/calculated', () => {
    it('invalid parameters to /grades/calculated', () => request(app)
    .get('/rest/v0/grades/calculated?year=2017&instructor=PATTIS R.')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body['status']).toEqual(400);
        expect(response.body['error']).toEqual("Bad Request: Invalid syntax in parameters");
        expect(response.body['message']).toMatch(/year/i);
    }));
});

describe('GET /grades/raw', () => {
    it('returns a json of all the grades distribution', async () => await request(app)
    .get('/rest/v0/grades/raw')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    }));
});

describe('GET /grades/raw', () => {
    it('returns a json of filtered grades distribution',  () => request(app)
    .get('/rest/v0/grades/raw?year=2018-19;2019-20&instructor=PATTIS R.&department=I%26C SCI&quarter=Fall&number=33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toEqual(expect.objectContaining({
            "year": expect.any(String),
            "instructor": "PATTIS R.",
            "code": expect.any(Number)
        }));
    }));
});

describe('GET /grades/raw', () => {
    it('invalid parameters to /grades/raw', () => request(app)
    .get('/rest/v0/grades/raw?year=2017-18&instructor=PATTIS R.&code=33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body['status']).toEqual(400);
        expect(response.body['error']).toEqual("Bad Request: Invalid syntax in parameters");
        expect(response.body['message']).toMatch(/code/i);
    }));
});