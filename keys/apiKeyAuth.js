var {executeQueryWithCallback, escape} = require('../config/database.js')

let apiKeyAuth = (req, res, next) => {
    if (req.app.get('env') === 'development') {
        next()
    }
    if (req.header('apiKey') === null) {
        res.json({
            error: "Missing API Key."
        })
    } else {
        let sql = `SELECT * FROM api_keys WHERE apiKey = ${escape(req.header('apiKey'))};`

        executeQueryWithCallback(sql, function(results) {
            if (results.length > 0) {
                if (results[0]["keyStatus"] === "Active") {
                    next()
                } else if (results[0]["keyStatus"] === "Awaiting Verification") {
                    res.json({
                        error: "You must verify your email before using the API. Follow the instruction sent to your email to complete your verification."
                    })
                } else if (results[0]["keyStatus"] === "Inactive") {
                    res.json({
                        error: "Your API Key has been deactivated."
                    })
                }
                
            } else {
                res.json({
                    error: "Invalid API Key."
                })
            }
        });
    }
}

module.exports = {apiKeyAuth}