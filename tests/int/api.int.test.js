const request = require('supertest');
const app = require('../../app');

// jest.setTimeout(5000)

describe('GET /courses/all', () => {
    it('returns a json of all the courses on the catalogue', async () => request(app)
    .get('/rest/v1/courses/all')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body['I&CSCI46']).not.toBeUndefined();
        expect(response.body['I&CSCI46']['id']).toEqual('I&C SCI 46');
    }));
});


describe('GET /courses/I&CSCI33', () => {
    it('returns a json of the specific course on the catalogue', async () => request(app)
    .get('/rest/v1/courses/I&CSCI33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body['id']).toEqual('I&C SCI 33');
        expect(response.body['name']).toEqual('Intermediate Programming');
        expect(Array.isArray(response.body['dependencies'])).toBeTruthy();
    }));
});