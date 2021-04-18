const supertest = require('./api.int.test');
const request = supertest.request;

jest.setTimeout(30000)


describe('GET /grades/calculated', () => {
    it('returns a json of all the grades distribution', async () => await request
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
    it('returns a json of filtered grades distribution',  () => request
    .get('/rest/v0/grades/calculated?year=2018-19;2019-20&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body).toHaveProperty('gradeDistribution')
        expect(Array.isArray(response.body['courseList'])).toBeTruthy();
        expect(response.body['courseList'].length).toBeGreaterThan(0);
        expect(response.body['courseList'][0]).toEqual(expect.objectContaining({
            "year": expect.any(String),
            "instructor": "PATTIS, R.",
            "code": expect.any(Number)
        }));
    }));
});

describe('GET /grades/calculated', () => {
    it('invalid parameters to /grades/calculated', () => request
    .get('/rest/v0/grades/calculated?year=2017&instructor=PATTIS, R.')
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

describe('GET /grades/calculated', () => {
    it('invalid parameters to /grades/calculated', () => request
    .get('/rest/v0/grades/calculated?year=2017-18&instructor=PATTIS,R')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body['status']).toEqual(400);
        expect(response.body['error']).toEqual("Bad Request: Invalid syntax in parameters");
        expect(response.body['message']).toMatch(/instructor/i);
    }));
});

describe('GET /grades/raw', () => {
    it('returns a json of all the grades distribution', async () => await request
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
    it('returns a json of filtered grades distribution',  () => request
    .get('/rest/v0/grades/raw?year=2018-19;2019-20&instructor=PATTIS, R.&department=I%26C SCI&quarter=Fall&number=33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toEqual(expect.objectContaining({
            "year": expect.any(String),
            "instructor": "PATTIS, R.",
            "code": expect.any(Number)
        }));
    }));
});

describe('GET /grades/raw', () => {
    it('invalid parameters to /grades/raw', () => request
    .get('/rest/v0/grades/raw?year=2017-18&instructor=PATTIS, R.&code=33')
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