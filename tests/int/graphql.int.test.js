const supertest = require('./api.int.test');
const request = supertest.request;
jest.setTimeout(10000)

describe('POST /graphql/', () => {
    it('returns a json of all the courses on the catalogue',  () => request
    .post('/graphql/')
    .send({query:"{\n  course(id:\"COMPSCI161\") {\n    id,\n    department,\n    description,\n  }\n}"})
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
