const usersController = require("../controllers/users_controllers.js");

const express = require("express");
const router = express.Router();

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/user-Profile", usersController.userProfile);
router.post("/otpLogin", usersController.otpLogin);
router.post("/verifyOTP", usersController.verifyOTP);

module.exports = router;