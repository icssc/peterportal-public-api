const supertest = require('./api.int.test');
const request = supertest.request;

jest.setTimeout(30000)

describe('GET /instructors/all', () => {
    it('returns a json of all instructors',  () => request
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
    it('returns a json of a specific instructor',  () => request
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
    it('returns an error for instructor that does not exist',  () => request
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