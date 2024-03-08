const express = require("express");
const router = express.Router();
const chatRoute = require("./chat.route");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");

const path = "/api/";

router.use(`${path}chat`, chatRoute); //api-v1/auth/
router.use(`${path}auth`, authRoute);
router.use(`${path}user`, userRoute);

module.exports = router;
