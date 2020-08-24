const fetch = require("node-fetch");
const fs = require("fs");

fetch('https://search-icssc-om3pkghp24gnjr4ib645vct64q.us-west-2.es.amazonaws.com/_search', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: 
        JSON.stringify({"_source": ["id_department", "id_number", "name"],
        "query": {
            "match_all":{}
        },
        "size": 10000
        })
}).then((response) => response.json()).then((data) => console.log(storeData(generateJSONOfCourses(data), "./../api/courses.json")));


function generateJSONOfCourses(result) {
    var json = {};
    result.hits.hits.forEach((e) => {
        json[e._id] = {dept: e._source.id_department, num: e._source.id_number, name: e._source.name};
        }
    )
    
    return {count: Object.keys(json).length, courses: json}
}

function storeData(data, path) {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}