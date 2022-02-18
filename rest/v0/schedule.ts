import express from 'express';
const router = express.Router();
import { createErrorJSON } from '../../helpers/errors.helper';
import { callWebSocAPI } from 'websoc-api';

router.get("/soc", function (req, res, next) {
    callWebSocAPI(req.query).then((val) => {
        res.json(val)
    }).catch((err) => {
        res.status(400).json(createErrorJSON(400, "Bad Request: Invalid parameter", "Unable to complete websoc-api query"));
    })
})


export default router;