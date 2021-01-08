const faunadb = require('faunadb')
const client = new faunadb.Client({ secret: process.env.FAUNADB_KEY});
const {
    Get,
    Ref,
    Collection,
    Match,
    Index,
    Map,
    Paginate,
    Lambda,
    Var
} = faunadb.query;

let apiKeyAuth = (req, res, next) => {
    if (!req.headers["x-api-key"]) {
        res.json({
            error: "No credentials sent!"
        })
    } else {
        client.query(
            Get(
                Match(Index("keys_by_key"), req.headers["x-api-key"])
            )
        ).then((ret) => {
            console.log(ret.data);
            next();
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send(err);
        });
    }
}

module.exports = {apiKeyAuth}