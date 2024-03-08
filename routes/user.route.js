const express = require("express");
const router = express.Router();
const fsPromises = require("fs/promises");
const path = require("path");
const { getAllUser } = require("../controller/user.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.route("/").get(verifyToken, getAllUser);

module.exports = router;
