const { getUserByEmail } = require("../models/users");

module.exports = {
  isActivated: async (req, res, next) => {
    let email = req.user.email;
    let isActive = await getUserByEmail(email);

    if (isActive.rowCount === 0) {
      return res.status(404).json({
        code: 404,
        message: "User not found or email not activated",
        data: [],
      });
    }

    if (isActive.rows[0].is_active === false) {
      return res.status(400).json({
        code: 400,
        message: "Email not active, please activate your email",
      });
    } else {
      return next();
    }
  },
};
