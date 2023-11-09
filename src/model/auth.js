const Pool = require("../config/database");

const CreateUsers = async (data) => {
  const { uuid, username, email, password } = data;

  try {
    const query = {
      text: "INSERT INTO users (uuid, username, email, password) VALUES($1, $2, $3, $4) RETURNING *",
      values: [uuid, username, email, password],
    };

    const result = await Pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user");
  }
};

const loginUser = async (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

module.exports = {
  CreateUsers,
  loginUser,
};
