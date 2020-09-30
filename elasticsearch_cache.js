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
.then((data) => {
    storeData(data, path.resolve('cache', 'es_courses_cache.json'))
    var result = {};
    data['hits']['hits'].forEach((e) => {
        result[e['_id']] = e["_source"]
    })
    storeData(result, path.resolve('cache', 'parsed_courses_cache.json'))

    // var result = {};
    // data['hits']['hits'].forEach((e) => {

    // result[e['_id']] = e['_source']['id_department'] + " " + e['_source']['id_number'];
    // })

    // storeData(result, path.resolve('cache', 'course_lookup.json'))
}
)

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