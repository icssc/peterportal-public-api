const fs = require('fs')
const fetch = require('node-fetch')
var path = require('path')
const dotenv = require('dotenv')
dotenv.config();

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
.then((data) => storeData(data, path.resolve('cache', 'courses_cache.json')))

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
.then((data) => storeData(data, path.resolve('cache', 'professors_cache.json')))

function storeData(data, path) {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

var CACHE_DIRECTORY = path.resolve('tmp', 'cache');