const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { createUser, checkEmailRegistered, checkUserIsActive, activateUser, updateOtpByUserEmail, resetOtpByUserEmail, updatePasswordByOtp } = require("../models/auth");
const { getUserByEmail, getUserByOtp } = require("../models/users");
const { sendMail } = require("../utils/sendMail");
const { sendOtpToMail } = require("../utils/sendOtpToEmail");

const authController = {
  register: async (req, res) => {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        code: 400,
        message: "name, email, and password is required!",
      });
    }

    let checkEmail = await checkEmailRegistered(email);
    let checkEmailResult = checkEmail.rows[0].count;

    if (checkEmailResult > 0) {
      return res.status(400).json({
        code: 400,
        message: "Email has been registered!",
      });
    }

    //   hash password
    let passwordHashed = await bcrypt.hash(password, 10);
    let data = { name, email, passwordHashed, uuid: uuidv4() };
    await createUser(data);

    if (!data) {
      return res.status(404).json({
        code: 404,
        message: "Register Failed!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Register success!",
    });
  },

  // setActivateUser: async (req, res, next) => {
  //   let id_user = req.params.id;
  //   let checkUser = await checkUserIsActive(id_user);

  //   if (checkUser.rows.length === 0) {
  //     return res.status(200).json({
  //       code: 200,
  //       message: "User not found or user has been activated!",
  //     });
  //   }

  //   await activateUser(checkUser.rows[0].uuid);

  //   res.status(200).json({
  //     code: 200,
  //     message: "User activated successfully",
  //   });
  // },

  login: async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: "email and password is required!",
      });
    }

    //   Check email is registered?
    let checkEmail = await getUserByEmail(email);
    console.log(checkEmail);
    if (checkEmail.rows.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Email not registered",
      });
    }

    //   Check password is match?
    let isMatch = bcrypt.compareSync(password, checkEmail.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({
        code: 400,
        message: "Incorrect password, please enter the correct password",
      });
    }

    // Check email is activated?
    if (checkEmail.rows[0].is_active === false) {
      return res.status(400).json({
        code: 400,
        message: "Email not active, please check your email to activated",
      });
    }

    // Generate token
    const accessToken = jwt.sign(checkEmail.rows[0], process.env.JWT_SECRET, { expiresIn: "1Y" });
    const refreshToken = jwt.sign(checkEmail.rows[0], process.env.JWT_REFRESH_SECRET, { expiresIn: "1Y" });
    res.status(200).json({
      code: 200,
      message: "Login success!",
      name: checkEmail.rows[0].name,
      uuid: checkEmail.rows[0].uuid,
      email: checkEmail.rows[0].email,
      photo: checkEmail.rows[0].photo,
      token: {
        accessToken,
        refreshToken,
      },
    });
  },

  refreshToken: async (req, res) => {
    let value = req.body;

    try {
      let decoded = jwt.verify(value.refreshToken, process.env.JWT_REFRESH_SECRET);
      let user = await getUserByEmail(decoded.email);

      if (!user) {
        res.status(200).json({
          code: 200,
          message: "User not found!",
        });
      }

      let accessToken = jwt.sign(user.rows[0], process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(200).json({
        code: 200,
        message: "Access token updated!",
        token: { accessToken },
      });
    } catch (error) {
      res.status(401).json({
        code: 401,
        message: error.message,
      });
    }
  },

  forgotPassword: async (req, res) => {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        code: 400,
        message: "Please insert your email!",
      });
    }

    let checkEmail = await getUserByEmail(email);
    if (checkEmail.rows.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Email not registered!",
      });
    }

    console.log(checkEmail.rows[0]);

    let otp = Math.floor(Math.random() * 90000) + 10000;
    let createOTP = await updateOtpByUserEmail(email, otp);

    if (!createOTP) {
      return res.status(404).json({
        code: 404,
        message: "Failed get otp!",
      });
    }

    const token = jwt.sign(email, process.env.JWT_SECRET);
    let sendEmailToUser = await sendOtpToMail(email, token, checkEmail.rows[0].name, otp);

    if (!sendEmailToUser) {
      await createUser.rollback();
      return res.status(500).json({
        code: 500,
        error: "Send email failed!",
        message: "Send otp failed!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Otp has been send to your email, please check your email",
    });
  },

  resetOtp: async (req, res) => {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        code: 400,
        message: "Please insert your email!",
      });
    }

    let checkEmail = await getUserByEmail(email);
    if (checkEmail.rows.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Email not registered!",
      });
    }

    let setNullOTP = await resetOtpByUserEmail(email);

    if (!setNullOTP) {
      return res.status(404).json({
        code: 404,
        message: "Failed reset otp!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Otp has been reset!",
    });
  },

  resetPassword: async (req, res) => {
    let { otp, password } = req.body;

    if (!otp || !password) {
      return res.status(400).json({
        code: 400,
        message: "Otp and password is required",
      });
    }

    let checkUserByOTP = await getUserByOtp(otp);
    if (checkUserByOTP.rows.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Code OTP Wrong!",
      });
    }

    let passwordHashed = await bcrypt.hash(password, 10);

    let updatePassword = await updatePasswordByOtp(otp, passwordHashed);

    if (!updatePassword) {
      return res.status(404).json({
        code: 404,
        message: "Failed reset password!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Password has been reset, please login with new password!",
    });
  },
};

module.exports = authController;
