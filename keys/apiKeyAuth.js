const faunadb = require('faunadb');
const { keys } = require('underscore');
const crypto = require('crypto')
var {createErrorJSON} = require("../rest/v0/errors.helper")
const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY});
const {
    Get,
    Ref,
    Collection,
    Match,
    Index,
    Update,
    Select,
    Paginate,
    Lambda,
    Var
} = faunadb.query;

let apiKeyAuth = (req, res, next) => {
    if (!req.headers["x-api-key"]) {
        res.status(401).json(createErrorJSON(401, "No credentials sent.", "No credentials were found in the header of the request. See documentation for more info."));
    } else {
        // add check to make sure key is active
        var key = req.headers['x-api-key'];
        const hash = crypto.createHash('sha256');
        var hashed_key = hash.update(key).digest('hex');
        client.query(
            Get(
                Match(Index("keys_by_key"), hashed_key)
            )
        ).then((ret) => {
            if (ret.data.status != 'active' ) {
                res.status(401).json(createErrorJSON(401, "Invalid Credentials.", "The credentials found has not been activated. Please check your email to activate the key."));
            } else if (ret.data.num_requests > parseInt(process.env.RATE_LIMIT)) {
                res.status(401).json(createErrorJSON(401, "Invalid Credentials.", "The API key found has surpassed the request limit. Email 'peterportal.dev@gmail.com' for support."));
            } else {
                client.query(
                    Update(
                        Select("ref", ret),
                        {
                          data: { num_requests: ret.data.num_requests + 1 }
                        }
                      )
                ).then(ret => {
                    console.log(ret);
                }).catch((err) => {
                    console.log("error", err);
                }) 
                next(); 
            }
        }).catch((err) => {
            console.log(err)
            res.status(401).json(createErrorJSON(401, "Invalid Credentials.", "The credentials found were invalid. Please ensure a valid api key is in the request. See documentation for more info."));
        });
    }
}

module.exports = {apiKeyAuth}