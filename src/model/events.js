const Pool = require("../config/database");

const insertEvent = async (data) => {
  const { recipes_id, users_id, status } = data;

  try {
    const result = await Pool.query("INSERT INTO events (recipes_id, users_id, status) VALUES ($1, $2, $3) RETURNING *", [recipes_id, users_id, status]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const selectAllEvent = async () => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM events`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectEventById = async (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM events WHERE id=${id}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteBookmarkById = async (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM events WHERE id=${id} AND status='bookmark'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteLikeById = async (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM events WHERE id=${id} AND status='like'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const getLikedRecipesByUser = async (userId) => {
  try {
    const result = await Pool.query(
      `SELECT recipes.id, recipes.title, recipes.photo_recipes,recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM events
      JOIN recipes ON events.recipes_id = recipes.id
      WHERE events.users_id = $1 AND events.status = 'like'`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};
const getBookmarkRecipesByUser = async (userId) => {
  try {
    const result = await Pool.query(
      `SELECT recipes.id, recipes.title, recipes.photo_recipes,recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM events
      JOIN recipes ON events.recipes_id = recipes.id
      WHERE events.users_id = $1 AND events.status = 'bookmark'`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const countMyBookmark = async (users_id) => {
  try {
    const result = await Pool.query("SELECT COUNT(*) FROM events WHERE users_id = $1 AND status = $2", [users_id, "bookmark"]);
    return result.rows[0].count;
  } catch (error) {
    throw error;
  }
};
const countMyLike = async (users_id) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM events WHERE users_id = $1 AND status = $2", [users_id, "like"]);
    return result.rows[0].count;
  } catch (error) {
    throw error;
  }
};

const checkIsLike = async (recipes_id, users_id) => {
  try {
    const result = await Pool.query("SELECT * FROM events WHERE recipes_id = $1 AND status = $2 AND users_id = $3", [recipes_id, "like", users_id]);
    return result;
  } catch (error) {
    throw error;
  }
};
const checkIsBookmark = async (recipes_id, users_id) => {
  try {
    const result = await Pool.query("SELECT * FROM events WHERE recipes_id = $1 AND status = $2 AND users_id = $3", [recipes_id, "bookmark", users_id]);
    return result;
  } catch (error) {
    throw error;
  }
};
const getIdOwnerEvent = async (id) => {
  try {
    const result = await Pool.query("SELECT * FROM events WHERE id = $1", [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

const selectCountLikedByIdRecipe = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM events WHERE recipes_id=${id_recipe} AND status='like'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectCountBookmarkedByIdRecipe = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM events WHERE recipes_id=${id_recipe} AND status='bookmark'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = {
  insertEvent,
  selectAllEvent,
  getLikedRecipesByUser,
  checkIsLike,
  selectEventById,
  deleteBookmarkById,
  deleteLikeById,
  getBookmarkRecipesByUser,
  countMyBookmark,
  countMyLike,
  checkIsBookmark,
  getIdOwnerEvent,
  selectCountLikedByIdRecipe,
  selectCountBookmarkedByIdRecipe,
};
