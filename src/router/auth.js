const express = require("express");
const { register, setActivateUser, login, refreshToken, forgotPassword, resetOtp, resetPassword } = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
// router.get("/activate/:id", setActivateUser);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/reset-otp", resetOtp);
router.post("/refresh", refreshToken);

module.exports = router;
