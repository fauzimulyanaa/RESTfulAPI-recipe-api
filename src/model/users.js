const Pool = require("../config/database");

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
    text: "SELECT uuid, username, email, password, photo_user  FROM users WHERE uuid = $1",
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

const updateUser = async (newData) => {
  const { username, email, password, photo_user, uuid } = newData;
  const query = `
    UPDATE users
    SET username = $1,  email = $2, password = $3, photo_user = $4
    WHERE uuid = $5
    RETURNING *
  `;

  const values = [username, email, password, photo_user, uuid];
  const result = await Pool.query(query, values);
  if (result.rowCount === 0) {
    // Tidak ada baris yang diupdate, mungkin karena UUID tidak sesuai
    throw new Error("No user found for update.");
  }

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
  getAllUsers,
  getUsersById,
  updateUser,
  deleteUser,
  getRecipesByUser,
  searchUser,
  getUsersSortedByUsername,
  getUsersPagination,
};
