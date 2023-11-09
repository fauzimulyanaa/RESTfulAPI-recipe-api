const jwt = require("jsonwebtoken");
require("dotenv").config();

const Protect = async (req, res, next) => {
  try {
    let { authorization } = req.headers;
    let Bearer = authorization.split(" ");
    let decode = jwt.decode(Bearer[1], process.env.ACCESS_TOKEN_SECRET);
    if (!decode || !decode.uuid) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    req.payload = decode;
    next();
  } catch (error) {
    return res.status(404).json({ status: 404, message: "token wrong" });
  }
};

module.exports = { Protect };
