const Pool = require("../config/database");

const getAllRecipes = async () => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `
      SELECT recipes.id, recipes.title, recipes.photo_recipes, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.uuid`,
      (err, result) => {
        if (!err) {
          return resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const getRecipes = async (data) => {
  let { search, searchBy, offset, limit, asc } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT recipes.id, recipes.title, recipes.photo_recipes, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category FROM recipes JOIN category ON recipes.category_id=category.id WHERE recipes.${searchBy} ILIKE '%${search}%' ORDER BY ID ${asc} offset ${offset} LIMIT ${limit}`,
      (err, result) => {
        if (!err) {
          return resolve(result);
        } else {
          reject(err);
        }
      }
    )
  );
};

const getRecipesCount = async (data) => {
  let { search, searchBy } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT COUNT(*) FROM recipes JOIN category ON recipes.category_id=category.id WHERE recipes.${searchBy} ILIKE '%${search}%'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        reject(err);
      }
    })
  );
};

const getAllRecipesByUserId = async (user_id) => {
  try {
    const query = `
     SELECT recipes.id, recipes.title, recipes.photo_recipes,recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.uuid
      WHERE user_id = $1`;

    const values = [user_id];

    const result = await Pool.query(query, values);

    return result;
  } catch (error) {
    throw new Error("Gagal mendapatkan resep berdasarkan user ID: " + error.message);
  }
};

const getRecipeById = async (id) => {
  try {
    const query = `
      SELECT recipes.id, recipes.title,recipes.photo_recipes, recipes.description, recipes.ingredients, recipes.instructions, category.id AS category_id, category.name AS category, users.username AS author, users.uuid AS user_id
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.uuid
      WHERE recipes.id = $1`;

    const values = [id];

    const result = await Pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getRecipesByCategory = async (id) => {
  try {
    const query = `
      SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.id
      WHERE category_id = $1`;

    const values = [id];

    const result = await Pool.query(query, values);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

const RecipeCreate = async (data) => {
  let { title, photo_recipes, description, ingredients, instructions, category_id, uuid } = data;
  try {
    const query = `
      INSERT INTO recipes (title,photo_recipes, description, ingredients, instructions, category_id, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    const values = [title, photo_recipes, description, ingredients, instructions, category_id, uuid];

    const result = await Pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateRecipe = async (data) => {
  try {
    const { id, title, photo_recipes, description, ingredients, instructions, category_id, user_id } = data;
    const query = `
      UPDATE recipes
      SET title = $2, photo_recipes = $3, description = $4, ingredients = $5, instructions = $6, category_id = $7
      WHERE id = $1 AND user_id = $8
      RETURNING *
    `;
    const values = [id, title, photo_recipes, description, ingredients, instructions, category_id, user_id]; // Tambahkan user_id ke values
    const result = await Pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteRecipe = async (recipeId) => {
  try {
    const query = `
      DELETE FROM recipes
      WHERE id = $1`;

    const values = [recipeId];

    const result = await Pool.query(query, values);

    return result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllRecipes,
  RecipeCreate,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getAllRecipesByUserId,
  getRecipesCount,
  getRecipes,
};
