import express from 'express';
const router = express.Router();
import version1Router from './v0/router'

router.get('/', function(req, res) {
    res.redirect('/rest/v0');
});

router.use("/v0", version1Router);

export default router;