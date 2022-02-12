import express from 'express';
const router = express.Router();
import coursesRouter from "./courses";
import gradesRouter from "./grades"
import instructorRouter from "./instructor"
import scheduleRouter from "./schedule"
import createErrorJSON from "../../helpers/errors.helper";

router.get("/", (req,res) => {
    res.redirect('/docs')
})

router.use("/courses", coursesRouter);
router.use("/instructors", instructorRouter);
router.use("/grades", gradesRouter);
router.use("/schedule", scheduleRouter);
router.use("*", (req, res) => {
    res.status(404).send(createErrorJSON(404, "Not Found", "The requested resource was not found."))
});

export default router;
