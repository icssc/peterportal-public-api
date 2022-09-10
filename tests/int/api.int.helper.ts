import request from "supertest";

import app from "../../app";

export default request.agent(app);
