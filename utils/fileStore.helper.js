const fs = require('fs');

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
async function parsedData(data, path) {
    var result = {};
    data['hits']['hits'].forEach((e) => {
        result[e['_id']] = e["_source"]
    })

    await storeData(result, path)
}

module.exports = {storeData, parsedData}