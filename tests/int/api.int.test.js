const request = require('supertest');
const app = require('../../app');


jest.setTimeout(30000);

describe('GET /courses/all', () => {
    it('returns a json of all the courses on the catalogue',  () => request(app)
    .get('/rest/v0/courses/all')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200));
});

module.exports.request = request.agent(app);
