const express = require("express");
const router = express.Router();
const {
  registerUser,
  signIn,
  signout,
} = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.route("/").post(registerUser);

router.route("/login").post(signIn);
router.route("/logout").post(verifyToken, signout);

module.exports = router;
