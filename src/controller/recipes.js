const recipeModel = require("../model/recipes");
const categoryModel = require("../model/category");

const getAllRecipes = async (req, res) => {
  try {
    let data = await recipeModel.getAllRecipes();
    let result = data.rows;

    if (!result) {
      return res.status(200).json({ message: "No data available" });
    }

    result.forEach((item) => {
      // Memisahkan string ingredients menjadi array
      if (item.ingredients) {
        item.ingredients = item.ingredients.split(",");
      }
    });

    res.json({
      message: "Get all data success",
      data: result,
    });
  } catch (error) {
    console.error(error); // Log kesalahan untuk debugging
    res.status(500).json({ message: "Failed to get data" });
  }
};

const recipeById = async (req, res) => {
  try {
    const recipeId = req.params.id; // Ambil ID resep dari parameter URL

    const recipe = await recipeModel.getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Get recipe by ID success", data: recipe });
  } catch (error) {
    console.error(error); // Log kesalahan untuk debugging
    res.status(500).json({ message: "Failed to get recipe by ID" });
  }
};

const createNewRecipe = async (req, res) => {
  try {
    let { title, description, ingredients, instructions, category_id, user_id } = req.body;

    // Validasi data yang dibutuhkan
    if (!title || !description || !ingredients || !instructions || !category_id || !user_id) {
      return res.status(400).json({ message: "title, description, ingredients, instructions, category_id, user_id are required" });
    }

    // Validasi kategori
    const category = await categoryModel.getAllCategory();
    const isValidCategory = category.some((item) => item.id === category_id);

    if (!isValidCategory) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Data resep yang valid
    let data = { title, description, ingredients, instructions, category_id: parseInt(category_id), user_id: parseInt(user_id) };

    let result = await recipeModel.RecipeCreate(data);
    res.status(200).json({ message: "Success input data", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to input data" });
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const { title, description, ingredients, instructions, category_id, user_id } = req.body;

    const recipe = await recipeModel.getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    let updatedData = {
      id: recipe.id,
      title: title || recipe.title,
      description: description || recipe.description,
      ingredients: ingredients || recipe.ingredients,
      instructions: instructions || recipe.instructions,
      category_id: parseInt(category_id) || recipe.category_id,
      user_id: parseInt(user_id) || recipe.user_id,
    };

    const updatedRecipe = await recipeModel.updateRecipe(recipeId, updatedData);

    res.status(200).json({ message: "Recipe updated successfully", data: updatedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await recipeModel.getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const deleted = await recipeModel.deleteRecipe(recipeId);

    if (deleted) {
      res.status(200).json({ message: "Recipe deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) {
      return res.status(400).json({ message: "Parameter require" });
    }
    const searchResults = await recipeModel.searchRecipes(searchTerm);
    if (searchResults.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Pencarian berhasil", data: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal melakukan pencarian" });
  }
};
const searchRecipesByCategory = async (req, res) => {
  try {
    const search = req.query.search;
    if (!search) {
      return res.status(400).json({ message: "Parameter require" });
    }
    const searchResults = await recipeModel.searchRecipesByCategory(search);
    if (searchResults.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Pencarian berhasil", data: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal melakukan pencarian" });
  }
};

const recipesPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const recipes = await recipeModel.getRecipesPagination(page, limit);

    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }

    res.status(200).json({ message: "Recipes retrieved successfully", data: recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve recipes" });
  }
};

const getRecipesByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const recipes = await recipeModel.getRecipesByCategory(id);

    if (recipes.length == 0) {
      return res.status(404).json({ message: "No recipes found for the given category" });
    }

    res.status(200).json({ message: "Recipes retrieved successfully", data: recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve recipes by category" });
  }
};

module.exports = {
  getAllRecipes,
  recipeById,
  createNewRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  searchRecipesByCategory,
  recipesPage,
  getRecipesByCategory,
};
