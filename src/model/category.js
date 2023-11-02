const Pool = require("../config/database");

const postCategory = async (data) => {
  const { name } = data;

  try {
    const query = {
      text: "INSERT INTO category (name) VALUES($1) RETURNING *",
      values: [name],
    };

    const result = await Pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const getAllCategory = async () => {
  try {
    const query = "SELECT * FROM category";
    const result = await Pool.query(query);

    return result.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }
};

const getCategoryById = async (id) => {
  const query = {
    text: "SELECT * FROM category WHERE id = $1",
    values: [id],
  };

  const result = await Pool.query(query);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

const patchCategory = async (categoryId, newData) => {
  const { nama } = newData;
  const query = `
    UPDATE category
    SET name = $1
    WHERE id = $2
    RETURNING *
  `;

  const values = [newData.name, categoryId];
  const result = await Pool.query(query, values);

  return result.rows[0];
};

const deleteCategory = async (id) => {
  try {
    const query = "DELETE FROM category WHERE id = $1";
    const values = [id];
    const result = await Pool.query(query, values);

    return result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  postCategory,
  getAllCategory,
  getCategoryById,
  patchCategory,
  deleteCategory,
};
