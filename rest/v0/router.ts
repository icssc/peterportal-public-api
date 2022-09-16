import express from "express";

import { createErrorJSON } from "../../helpers/errors.helper";
import coursesRouter from "./courses";
import gradesRouter from "./grades";
import instructorRouter from "./instructor";
import scheduleRouter from "./schedule";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/docs");
});

router.use("/courses", coursesRouter);
router.use("/instructors", instructorRouter);
router.use("/grades", gradesRouter);
router.use("/schedule", scheduleRouter);
router.use("*", (req, res) => {
  res
    .status(404)
    .json(
      createErrorJSON(404, "Not Found", "The requested resource was not found.")
    );
});

export default router;
