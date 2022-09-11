import express from "express";
import { graphqlHTTP } from "express-graphql";

import schema from "./schema";

const router = express.Router();

router.use("/", (req, res, next) => {
  graphqlHTTP({
    schema,
    graphiql: true,
  })(req, res).catch(next);
});

export default router;
