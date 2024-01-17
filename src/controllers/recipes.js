const cloudinary = require("../config/photo");
const { getAllCategory } = require("../models/category");
const { selectAllRecipes, selectRecipeById, inputRecipe, updateRecipe, deleteRecipeById, countAll, getRecipeByIdUser, countMyRecipe, countRecipes, selectNewRecipes, selectSuggestionRecipes } = require("../models/recipes");
const createPagination = require("../utils/createPagination");
const axios = require("axios");

const recipesController = {
  allRecipes: async (req, res) => {
    // Pagination
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || "";
    let keyword = search.toLowerCase();
    let searchBy = req.query.search_by;
    let sort = req.query.sort;
    let id_category = req.query.category;
    let popular = req.query.popular;
    console.log(popular);

    // check serach by
    let listSearch = ["title", "ingredients", undefined];
    if (!listSearch.includes(searchBy)) {
      return res.status(404).json({ messsage: "Search invalid" });
    }

    // check sort
    let listSort = ["title", "updated_time", "category", undefined];
    if (!listSort.includes(sort)) {
      return res.status(404).json({ messsage: "Sort invalid" });
    }

    let count = await countAll(keyword, searchBy, id_category);
    let paging = createPagination(count.rows[0].count, page, limit);

    let recipes = await selectAllRecipes(paging, keyword, searchBy, sort, id_category, popular);
    let data = recipes.rows;

    if (data.length == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    // change items ingredients with split
    data.forEach((items, i) => {
      let ingredients = items.ingredients.split(",");
      data[i].ingredients = ingredients;
    });

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data,
      pagination: paging.response,
    });
  },

  getRecipeById: async (req, res) => {
    let id_recipe = req.params.id;

    let recipe = await selectRecipeById(id_recipe);
    let data = recipe.rows[0];

    if (!data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    // change items ingredients with split
    let { title, ingredients, photo, uuid_author, author, photo_author, created_time, updated_time, category, id_category, like, comments, bookmark } = data;
    ingredients = data.ingredients.split(",");
    let result = { title, ingredients, photo, uuid_author, author, photo_author, created_time, updated_time, category, id_category, like, comments, bookmark };

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result,
    });
  },

  showRecipeByIdUser: async (req, res) => {
    // pagination
    let id_user = req.user.id_user;
    let uuid = req.params.id;
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || "";
    let sort = req.query.sort;
    let count = await countMyRecipe(uuid, search);
    let paging = createPagination(count.rows[0].count, page, limit);

    // check sort
    let lisSort = ["title", "updated_time", "category", undefined];
    if (!lisSort.includes(sort)) {
      return res.status(404).json({ messsage: "Sort invalid" });
    }

    let recipes = await getRecipeByIdUser(uuid, paging, search, sort);
    let data = recipes.rows;

    if (data.length == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    // change items ingredients with split
    data.forEach((items, i) => {
      let ingredients = items.ingredients.split(",");
      data[i].ingredients = ingredients;
    });

    res.status(200).json({
      code: 200,
      message: `Success get recipes user: ${data[0].author}`,
      data: data,
      pagination: paging.response,
    });
  },

  postRecipe: async (req, res) => {
    let { title, ingredients, id_category } = req.body;
    let id_user = req.user.id_user;
    let uuid = req.user.uuid;

    if (!req.file) {
      return res.status(400).json({ messsage: "photo is required and must be image file" });
    }

    if (!req.isFileValid) {
      return res.status(400).json({ messsage: isFileValidMessage });
    }

    if (!title || !ingredients || !id_user || !id_category || !uuid) {
      return res.status(400).json({
        code: 400,
        message: "title, ingredients, and id category is required",
      });
    }

    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: "recipes",
    });

    if (!imageUpload) {
      return res.status(400).json({ messsage: "upload photo failed" });
    }

    // check category
    let category = await getAllCategory();
    let is_category = false;
    category.rows.forEach((items) => {
      if (items.id_category == id_category) return (is_category = true);
    });

    if (!is_category) {
      return res.status(404).json({ messsage: "category invalid" });
    }

    let data = { photo: imageUpload.secure_url, title, ingredients, id_user, id_category, uuid };
    let result = await inputRecipe(data);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Failed input data!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success input data!",
      data,
    });
  },

  putRecipe: async (req, res) => {
    let id_recipe = req.params.id;
    let id_user = req.user.id_user;
    let uuid = req.user.uuid;
    let { title, ingredients, id_category } = req.body;

    let recipe_data = await selectRecipeById(id_recipe);

    if (recipe_data.rowCount == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    let data = recipe_data.rows[0];

    // check category
    if (!id_category) {
      id_category = data.id_category;
    } else if (isNaN(parseInt(id_category))) {
      return res.status(404).json({ messsage: "category invalid" });
    } else {
      let category = await getAllCategory();
      let is_category = false;
      category.rows.forEach((items) => {
        if (items.id_category == id_category) return (is_category = true);
      });
      if (!is_category) {
        return res.status(404).json({ messsage: "category invalid" });
      }
    }

    let newData = {
      id_recipe: data.id_recipe,
      title: title || data.title,
      ingredients: ingredients || data.ingredients,
      id_user: id_user || data.id_user,
      id_category: id_category || data.id_category,
      uuid: uuid || data.uuid,
    };

    // check photo
    if (!req.file) {
      if (req.isFileValid === undefined || req.isFileValid) {
        newData.photo = data.photo;
        let result = await updateRecipe(newData);

        if (!result) {
          return res.status(404).json({
            code: 404,
            message: "Failed update data!",
          });
        }

        return res.status(200).json({
          code: 200,
          message: "Success update data!",
        });
      } else {
        return res.status(404).json({
          messsage: "failed update data, photo must be image file",
        });
      }
    }

    if (req.file) {
      if (req.isFileValid === false) {
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
      newData.photo = imageUpload.secure_url;

      let result = await updateRecipe(newData);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: "Failed update data!",
        });
      }

      res.status(200).json({
        code: 200,
        message: "Success update data!",
      });
    }
  },

  deleteRecipeId: async (req, res) => {
    let id_recipe = req.params.id;

    let data = await selectRecipeById(id_recipe);
    let result = data.rows[0];

    if (!result) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    await deleteRecipeById(id_recipe);
    res.status(200).json({
      code: 200,
      message: "Success delete data!",
    });
  },

  myRecipes: async (req, res) => {
    // pagination
    let id_user = req.user.id_user;
    let uuid = req.user.uuid;
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || "";
    let sort = req.query.sort;
    let count = await countMyRecipe(uuid, search);
    let paging = createPagination(count.rows[0].count, page, limit);

    // check sort
    let lisSort = ["title", "updated_time", "category", undefined];
    if (!lisSort.includes(sort)) {
      return res.status(404).json({ messsage: "Sort invalid" });
    }

    let recipes = await getRecipeByIdUser(uuid, paging, search, sort);
    let data = recipes.rows;

    if (data.length == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    // change items ingredients with split
    data.forEach((items, i) => {
      let ingredients = items.ingredients.split(",");
      data[i].ingredients = ingredients;
    });

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: data,
      pagination: paging.response,
    });
  },

  getCountRecipesByUuid: async (req, res) => {
    let uuid = req.params.id;

    let data = await countRecipes(uuid);
    let count = data.rows[0];

    if (!data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: count,
    });
  },

  showNewRecipe: async (req, res) => {
    let data = await selectNewRecipes();
    let result = data.rows;

    if (!data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result,
    });
  },

  showSuggestionRecipe: async (req, res) => {
    let data = await selectSuggestionRecipes();
    let result = data.rows;

    if (!data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result,
    });
  },
};

module.exports = recipesController;
