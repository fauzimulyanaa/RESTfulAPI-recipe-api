const Pool = require("../config/database");

const getAllRecipes = async () => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `
      SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.id`,
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

const getRecipeById = async (recipeId) => {
  try {
    const query = `
     SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.id
      WHERE recipes.id = $1`;

    const values = [recipeId];

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
  let { title, description, ingredients, instructions, category_id, user_id } = data;
  try {
    const query = `
      INSERT INTO recipes (title, description, ingredients, instructions, category_id, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;
    const values = [title, description, ingredients, instructions, category_id, user_id];

    const result = await Pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// const updateRecipe = async (recipeId, newData) => {
//   let { title, description, ingredients, instructions, category_id, user_id } = newData;
//   try {
//     const query = `
//       UPDATE recipes
//       SET title = $1, description = $2, ingredients = $3, instructions = $4, category_id = $5, user_id = $6
//       WHERE id = $7
//       RETURNING *`;

//     const values = [title, description, ingredients, instructions, category_id, user_id, recipeId];

//     const result = await Pool.query(query, values);

//     return result.rows[0];
//   } catch (error) {
//     throw error;
//   }
// };

const updateRecipe = async (recipeId, newData) => {
  try {
    const { title, description, ingredients, instructions, category_id, user_id } = newData;
    const query = `
      UPDATE recipes
      SET title = $1, description = $2, ingredients = $3, instructions = $4, category_id = $5, user_id = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [newData.title, newData.description, newData.ingredients, newData.instructions, newData.category_id, newData.user_id, recipeId];
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

const searchRecipes = async (searchTerm) => {
  const query = `
    SELECT * FROM recipes
    WHERE title ILIKE $1
  `;
  const values = [`%${searchTerm}%`];
  const result = await Pool.query(query, values);
  return result.rows;
};

const searchRecipesByCategory = async (search) => {
  const query = `
    SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients, recipes.instructions, category.name AS category, users.username AS author
      FROM recipes
      JOIN category ON recipes.category_id = category.id
      JOIN users ON recipes.user_id = users.id 
      WHERE category.name ILIKE $1
  `;
  const values = [`%${search}%`];
  const result = await Pool.query(query, values);
  return result.rows;
};

const getRecipesPagination = async (page, limit) => {
  const offset = (page - 1) * limit;
  const query = `
  SELECT recipes.id, recipes.title, recipes.description, recipes.ingredients,  recipes.instructions, category.name AS category, users.username AS author
  FROM recipes JOIN category ON recipes.category_id = category.id
  JOIN users ON recipes.user_id = users.id  ORDER BY id LIMIT $1 OFFSET $2`;
  const values = [limit, offset];
  const result = await Pool.query(query, values);
  return result.rows;
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  RecipeCreate,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  searchRecipesByCategory,
  getRecipesPagination,
  getRecipesByCategory,
};
