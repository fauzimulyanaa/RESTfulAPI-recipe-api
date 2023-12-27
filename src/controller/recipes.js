const recipeModel = require("../model/recipes");
const categoryModel = require("../model/category");
const cloudinary = require("../config/photo");

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

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await recipeModel.getRecipeById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe successfully retrieved", data: recipe });
  } catch (error) {
    res.status(500).json({ message: "A server error occurred" });
  }
};

const getRecipesUser = async (req, res, next) => {
  try {
    let { uuid } = req.payload;
    let recipes = await recipeModel.getAllRecipesByUserId(uuid);
    let data = recipes.rows;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    data.forEach((item, index) => {
      let ingredients = item.ingredients.split(",");
      data[index].ingredients = ingredients;
      console.log(item.ingredients);
    });

    res.status(200).json({ message: `Success getting recipes for user`, data });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while retrieving the prescription" });
  }
};

const getRecipesDetail = async (req, res, next) => {
  let { search, searchBy, limit, sortBy } = req.query;

  searchBy = searchBy || "title";
  let limiter = limit || 5;
  let page = req.query.page || 1;
  let asc = sortBy || "ASC";

  console.log(req.query);

  let data = {
    searchBy,
    search: search || "",
    offset: (page - 1) * limiter,
    limit: limit || 3,
    asc,
  };

  let recipes = await recipeModel.getRecipes(data);
  let result = recipes.rows;
  let { rows } = await recipeModel.getRecipesCount(data);
  let count = parseInt(rows[0].count);
  console.log("count");
  console.log(count);

  let pagination = {
    totalPage: Math.ceil(count / limiter),
    totalData: count,
    pageNow: parseInt(page),
  };

  if (!result) {
    return res.status(404).json({ messsage: "failed get result" });
  }

  result.forEach((item, index) => {
    let ingredients = item.ingredients.split(",");
    result[index].ingredients = ingredients;
  });

  res.status(200).json({
    messsage: "success get data",
    data: result,
    dataLength: result.length,
    pagination,
  });
};

const createNewRecipe = async (req, res, next) => {
  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);
  let { title, description, ingredients, instructions, category_id } = req.body;
  let { uuid } = req.payload;
  if (!req.file) {
    return res.status(400).json({ message: "Photo is required" });
  }
  if (!req.isFileValid) {
    return res.status(400).json({ message: "Invalid file" });
  }

  try {
    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: "recipes",
    });

    if (!imageUpload.secure_url) {
      return res.status(400).json({ message: "Upload photo failed" });
    }

    if (!title || !description || !ingredients || !instructions || !category_id) {
      return res.status(400).json({message: "Failed input data: Missing required fields" });
    }

    let category = await categoryModel.getAllCategory();
    let is_category = false;
    category.forEach((item) => {
      if (item.id == category_id) {
        is_category = true;
      }
    });

    if (!is_category) {
      return res.status(404).json({ messsage: "category invalid" });
    }

    let data = {
      title,
      description,
      ingredients,
      instructions,
      category_id: parseInt(category_id),
      uuid,
      photo_recipes: imageUpload.secure_url,
    };

    let result = await recipeModel.RecipeCreate(data);

    if (!result) {
      return res.status(400).json({ message: "Failed input data" });
    }

    res.status(200).json({ message: "Success input data", data: result });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "A server error occurred", error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  let id = req.params.id;
  let { uuid } = req.payload;
  let { title, description, ingredients, instructions, category_id } = req.body;

  let recipe_data = await recipeModel.getRecipeById(id);

  if (!recipe_data) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  if (recipe_data.user_id !== uuid) {
    return res.status(404).json({ messsage: "failed, data cannot update by this user" });
  }

  // check category

  if (!category_id) {
    category_id = recipe_data.category_id;
  } else if (isNaN(parseInt(category_id))) {
    return res.status(404).json({ messsage: "category invalid" });
  } else {
    let category = await categoryModel.getAllCategory();
    let is_category = false;
    category.forEach((item) => {
      if (item.id == category_id) {
        is_category = true;
      }
    });
    if (!is_category) {
      return res.status(404).json({ messsage: "category not found" });
    }
  }
  const updatedData = {
    id: id,
    title: title || recipe_data.title,
    description: description || recipe_data.description,
    ingredients: ingredients || recipe_data.ingredients,
    instructions: instructions || recipe_data.instructions,
    category_id: category_id,
    user_id: recipe_data.user_id,
  };

  if (!req.file) {
    updatedData.photo_recipes = recipe_data.photo_recipes;

    let result = await recipeModel.updateRecipe(updatedData);

    if (!result) {
      return res.status(404).json({ messsage: "failed update data" });
    }
    return res.status(200).json({ messsage: "success update data without photo" });
  }

  if (req.file) {
    if (!req.isFileValid) {
      return res.status(404).json({
        messsage: "failed update data, photo must be image file",
      });
    }
    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: "recipes",
    });

    if (!imageUpload) {
      return res.status(400).json({ messsage: "upload photo failed" });
    }
    updatedData.photo_recipes = imageUpload.secure_url;
  }

  let result = await recipeModel.updateRecipe(updatedData);

  if (!result) {
    return res.status(404).json({ messsage: "failed update data" });
  }
  res.status(200).json({ messsage: "success update data" });
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

module.exports = {
  getAllRecipes,
  getRecipeById,
  createNewRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesUser,
  getRecipesDetail,
};
