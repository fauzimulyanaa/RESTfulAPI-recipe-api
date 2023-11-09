const jwt = require("jsonwebtoken");
require("dotenv").config();

const GenerateToken = (data) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
  return token;
};

module.exports = { GenerateToken };
