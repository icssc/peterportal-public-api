import express from "express";

import version1Router from "./v0/router";

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/rest/v0");
});

router.use("/v0", version1Router);

export default router;
