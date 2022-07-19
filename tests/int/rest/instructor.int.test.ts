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
        expect(result['error']).toEqual("Not Found");
        expect(result['message']).toEqual("Instructor not found");
    }));
});

describe('GET /instructors/pattis;mikes', () => {
    it('returns an error message for a course that does not exist',  () => request
    .get('/rest/v0/instructors/pattis;mikes')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        const result: {[key: string]: Instructor} = response.body;
        expect(result["pattis"]).toMatchObject({"name": "Richard Eric Pattis", "ucinetid": "pattis"});
        expect(result["mikes"]).toMatchObject({"name": "Michael Shindler", "ucinetid": "mikes"});
        expect(Object.keys(result).length).toEqual(2);
    }));
});

describe('GET /instructors/pattis;nonexistent', () => {
    it('returns correct for one course, and null for nonexistent course',  () => request
    .get('/rest/v0/instructors/pattis;nonexistent')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
        const result: {[key: string]: Instructor} = response.body;
        expect(result["pattis"]).toMatchObject({"name": "Richard Eric Pattis", "ucinetid": "pattis"});
        expect(result["nonexistent"]).toBeNull();
        expect(Object.keys(result).length).toEqual(2);
    }));
});