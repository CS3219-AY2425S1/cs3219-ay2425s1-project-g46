// Author(s): Xiu Jia
const express = require("express");

const apiRouter = express.Router();

const userRoute = require("./userRoute");
const questionRoute = require("./questionRoute");
const collaborationRoute = require("./collaborationRoute");

apiRouter.use("/user", userRoute);
apiRouter.use("/question", questionRoute);
apiRouter.use("/collaboration", collaborationRoute);

module.exports = apiRouter;