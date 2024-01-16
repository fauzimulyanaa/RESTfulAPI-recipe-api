const Pool = require("../config/db");

const countAll = async (search) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM users WHERE LOWER(name) LIKE'%${search}%'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const showAllUsers = async (paging, search, sort = "name") => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id_user, name, email, phone_number, photo, created_time, uuid FROM users WHERE LOWER(name) LIKE'%${search}%'`;
    if (sort === "created_time") {
      query += ` ORDER BY created_time DESC`;
    } else {
      query += ` ORDER BY ${sort}`;
    }
    query += ` LIMIT ${paging.limit} OFFSET ${paging.offset}`;
    Pool.query(query, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const showUserById = async (uuid) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT id_user, uuid, name, email, phone_number, photo, created_time, level FROM users WHERE uuid='${uuid}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectMyAccount = async (uuid) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM users WHERE uuid='${uuid}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteUserById = async (uuid) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM users WHERE uuid='${uuid}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const updateUserById = async (data) => {
  const { name, email, password, phone_number, photo, uuid } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`UPDATE users SET name='${name}', email='${email}', password='${password}', phone_number='${phone_number}', photo='${photo}', updated_time=current_timestamp WHERE uuid='${uuid}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const getUserByOtp = async (otp) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM users WHERE otp=${otp}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = {
  showAllUsers,
  countAll,
  showUserById,
  deleteUserById,
  updateUserById,
  getUserByEmail,
  selectMyAccount,
  getUserByOtp,
};
