// Server Maintenance pipeline dependency:
// This script must be ran after any modification to the main PeterPortal ES database.
// It is a good idea to run this routinely to ensure that the local data is in synced with ES.

const fs = require('fs');
const fetch = require('node-fetch');
var path = require('path');
const dotenv = require('dotenv').config();

// fs mechanism to save json data in path
async function storeData(data, path) {
    try {
        await fs.writeFileSync(path, JSON.stringify(data));
        console.log('Data saved: ' + path)
    } catch (err) {
        console.error(err)
    }
}

// Remove ES response metadata -> parse and save relevant data
function parsedData(data, path) {
    var result = {};
    data['hits']['hits'].forEach((e) => {
        result[e['_id']] = e["_source"]
    })

    storeData(result, path)
}

// Send request to ES server to query the 'courses' index for all courses in the database
// to be stored locally in the ./cache directory.
fetch(process.env.ELASTIC_ENDPOINT_URL + 'courses/_search/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "size": 10000
    })
})
.then((res) => res.json())
.then((data) => {
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
})

// Send request to ES server to query the 'professors' index for all professors in the database
// to be stored locally in the ./cache directory.
fetch(process.env.ELASTIC_ENDPOINT_URL + 'professors/_search/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "size": 10000
    })
})
.then((res) => res.json())
.then((data) => {
    // Save raw response from ES
    // storeData(data, path.resolve('cache', 'professors_cache.json'))
    console.log("Received response from ES/professors, saving data... ")

    parsedData(data, path.resolve('./cache', 'parsed_professor_cache.json'))
})


