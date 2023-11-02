const Pool = require("../config/database");

const CreateUsers = async (data) => {
  const { username, password, email, full_name } = data;

  try {
    const query = {
      text: "INSERT INTO users(username, password, email, full_name) VALUES($1, $2, $3, $4) RETURNING *",
      values: [username, password, email, full_name],
    };

    const result = await Pool.query(query);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const getAllUsers = async () => {
  try {
    const query = "SELECT * FROM users";
    const result = await Pool.query(query);

    return result.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }
};

const getUsersById = async (id) => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };

  const result = await Pool.query(query);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

const getRecipesByUser = async (userId) => {
  try {
    const query = `
      SELECT id, title, description, ingredients, instructions
      FROM recipes
      WHERE user_id = $1
    `;
    const values = [userId];
    const result = await Pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userId, newData) => {
  const { username, password, email, full_name } = newData;
  const query = `
    UPDATE users
    SET username = $1, password = $2, email = $3, full_name = $4
    WHERE id = $5
    RETURNING *
  `;

  const values = [newData.username, newData.password, newData.email, newData.full_name, userId];
  const result = await Pool.query(query, values);

  return result.rows[0];
};

const deleteUser = async (userId) => {
  try {
    // Hapus semua resep yang terkait dengan pengguna.
    const deleteRecipesQuery = "DELETE FROM recipes WHERE user_id = $1";
    await Pool.query(deleteRecipesQuery, [userId]);

    // Hapus pengguna.
    const deleteUserQuery = "DELETE FROM users WHERE id = $1";
    await Pool.query(deleteUserQuery, [userId]);
  } catch (error) {
    throw error;
  }
};

const searchUser = async (search) => {
  const query = `
    SELECT * FROM users
    WHERE username ILIKE $1
  `;
  const values = [`%${search}%`];
  const result = await Pool.query(query, values);
  return result.rows;
};

const getUsersSortedByUsername = async (order) => {
  try {
    const query = `
      SELECT * FROM users
      ORDER BY username ${order};`;

    const result = await Pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getUsersPagination = async (page, limit) => {
  const offset = (page - 1) * limit;
  const query = `
  SELECT * FROM users  ORDER BY id LIMIT $1 OFFSET $2`;
  const values = [limit, offset];
  const result = await Pool.query(query, values);
  return result.rows;
};

module.exports = {
  CreateUsers,
  getAllUsers,
  getUsersById,
  updateUser,
  deleteUser,
  getRecipesByUser,
  searchUser,
  getUsersSortedByUsername,
  getUsersPagination,
};
