const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "Access Denied!",
    });
  }

  try {
    let verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({
      status: res.statusCode,
      message: "Invalid Token",
    });
  }
};

module.exports = verifyToken;
