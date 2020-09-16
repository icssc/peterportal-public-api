const cache = require('../../cache/courses_cache.json')

function getAllCourses() {
    var result = {};
    cache['hits']['hits'].forEach((e) => {

    result[e['_id']] = {department: e['_source']['id_department'],
                    number: e['_source']['id_number'],
                    school: e['_source']['school'], 
                    title: e['_source']['name'],
                    description: e['_source']['description'] }
    })
    return result;
}


module.exports = {getAllCourses}