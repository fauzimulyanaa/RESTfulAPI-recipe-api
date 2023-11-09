const { CreateUsers, loginUser } = require("../model/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { GenerateToken } = require("../helpers/token");

const userRegister = async (req, res) => {
  const { username, email, password, confPassword } = req.body;

  if (!username || !email || !password || !confPassword) {
    return res.status(400).json({ status: 400, message: "email password username is required" });
  }

  if (password !== confPassword) {
    return res.status(400).json({ message: "Password Does'n match" });
  }

  try {
    // Membuat salt dan mengenkripsi kata sandi
    const salt = await bcrypt.genSalt(10); // Anda harus menentukan jumlah putaran
    console.log("Salt yang digunakan:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = {
      uuid: uuidv4(),
      email,
      password: hashedPassword,
      username,
    };

    await CreateUsers(data);
    res.status(200).json({ status: 200, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Registration failed" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: 400, message: "email & password is required" });
  }

  let { rows, rowCount } = await loginUser(email);
  let user = rows[0];
  console.log(user);

  if (rowCount == 0) {
    return res.status(400).json({ status: 400, message: "email not found, please register" });
  }

  let match = await bcrypt.compare(req.body.password, user.password);
  console.log(match);
  if (!match) {
    return res.status(400).json({ status: 400, message: "Password salah" });
  }

  let token = GenerateToken(user);
  user.token = token;

  console.log(user);
  res.status(200).json({ status: 200, message: "login success", data: user });
};

module.exports = {
  userRegister,
  userLogin,
};
