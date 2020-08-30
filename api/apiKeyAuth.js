var {executeQueryWithCallback, escape} = require('../config/database.js')

let apiKeyAuth = (req, res, next) => {
    let sql = `SELECT * FROM api_keys WHERE apiKey = ${escape(req.header('apiKey'))};`

    executeQueryWithCallback(sql, function(results) {
        if (results.length > 0 && results[0]["keyStatus"] === "Active") {
            next()
        } else {
            res.json({
                error: "Invalid API Key"
            })
        }
    });
}

module.exports = {apiKeyAuth}