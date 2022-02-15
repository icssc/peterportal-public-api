import request from '../api.int.helper';

jest.setTimeout(30000);



describe('GET /nonexistent', () => {
    it('returns a 404 for unknown route',  () => request
    .get('/rest/v0/nonexistent')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404)
    .then((response) => {
        console.log(response.body)
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body['status']).toEqual(404);
        expect(response.body['error']).toEqual("Not Found");
        expect(response.body['message']).toEqual("The requested resource was not found.");
    }));
});

describe('GET /courses/all', () => {
    it('returns a json of all the courses on the catalogue',  () => request
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
    it('returns a json of the specific course on the catalogue',  () => request
    .get('/rest/v0/courses/I&CSCI33')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        expect(response.body['id']).toEqual('I&CSCI33');
        expect(response.body['title']).toEqual('Intermediate Programming');
        expect(Array.isArray(response.body['prerequisite_for'])).toBeTruthy();
    }));
});

describe('GET /courses/I&CSCI0000000', () => {
    it('returns an error message for a course that does not exist',  () => request
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