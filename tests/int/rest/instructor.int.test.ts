import request from '../api.int.helper';
import {Error, Instructor} from "../../../types/types";

jest.setTimeout(30000)

describe('GET /instructors/all', () => {
    it('returns a json of all instructors',  () => request
    .get('/rest/v0/instructors/all')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        const result : Instructor[] = response.body;
        expect(Array.isArray(result)).toBeTruthy();
        expect(result).toContainEqual(
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
        const result : Instructor = response.body;
        expect(result['name']).toEqual('Michael Shindler');
        expect(result['department']).toEqual('Computer Science');
        expect(Array.isArray(result['course_history'])).toBeTruthy();
    }));
});

describe('GET /instructors/randomguy', () => {
    it('returns an error for instructor that does not exist',  () => request
    .get('/rest/v0/instructors/randomguy')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(404)
    .then((response) => {
        const result : Error = response.body;
        expect(result).toHaveProperty('timestamp');
        expect(result['status']).toEqual(404);
        expect(result['error']).toEqual("Bad Request: Invalid parameter");
        expect(result['message']).toEqual("Instructor not found");
    }));
});