// Server Maintenance pipeline dependency:
// This script must be ran after any modification to the main PeterPortal ES database.
// It is a good idea to run this routinely to ensure that the local data is in synced with ES.

const fs = require('fs');
const fetch = require('node-fetch');
var path = require('path');
const dotenv = require('dotenv').config();
const {storeData, parsedData} = require("./fileStore.helper");
const {mapInstructorName} = require("./mapInstructorID");

async function fetchCourses() {
    // Send request to ES server to query the 'courses' index for all courses in the database
    // to be stored locally in the ./cache directory.
    const res = await fetch(process.env.ELASTIC_ENDPOINT_URL + 'courses/_search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "size": 10000
        })
    });
    const data = await res.json();
    console.log("Received response from ES/courses, saving data... ")
    // Save raw response from ES
    // storeData(data, path.resolve('cache', 'raw_es_courses_cache.json'))

    // Create a mapping of courseID to course department + " " + course number
    // Primarily to be used for websoc-api since UCI WebSoC uses a different format for course idenifier
    var result = {};
    data['hits']['hits'].forEach((e) => {
        result[e['_id']] = e['_source']['department'] + " " + e['_source']['number'];
    })
    storeData(result, path.resolve('cache', 'course_lookup.json'))
    
    parsedData(data, path.resolve('cache', 'parsed_courses_cache.json'))
}

async function fetchInstructors() {
    // Send request to ES server to query the 'professors' index for all professors in the database
    // to be stored locally in the ./cache directory.
    const res = await fetch(process.env.ELASTIC_ENDPOINT_URL + 'professors/_search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "size": 10000
        })
    })
    const data = await res.json();
    // Save raw response from ES
    // storeData(data, path.resolve('cache', 'professors_cache.json'))
    console.log("Received response from ES/professors, saving data... ")

    await parsedData(data, path.resolve('./cache', 'parsed_professor_cache.json'))

    //Create the mapping from shortened instructor names to ucinetids.
    mapInstructorName();
}

fetchCourses();
fetchInstructors();

