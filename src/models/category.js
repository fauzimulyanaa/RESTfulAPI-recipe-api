const Pool = require("../config/db");

const getAllCategory = async () => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM category ORDER BY id_category`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const getCategoryById = async (id_category) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM category WHERE id_category=${id_category}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const createCategory = async (data) => {
  const { name } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`INSERT INTO category (name) VALUES ('${name}')`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const updateCategory = async (data) => {
  const { id_category, name } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`UPDATE category SET name='${name}' WHERE id_category=${id_category}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteCategory = (id_category) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM category WHERE id_category=${id_category}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory };
