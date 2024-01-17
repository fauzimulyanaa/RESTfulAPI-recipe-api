const { selectAllComments, selectCommentsByIdRecipe, insertCommentsByIdRecipe, countCommentsByIdRecipe } = require("../models/comments");
const { selectRecipeById } = require("../models/recipes");
const createPagination = require("../utils/createPagination");

const commentsController = {
  getAllComments: async (req, res) => {
    let result = await selectAllComments();
    let data = result.rows;

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
      data,
    });
  },

  getCommentsByIdRecipe: async (req, res) => {
    let id_recipe = req.params.id;

    //   pagination
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 5;
    let count = await countCommentsByIdRecipe(id_recipe);
    let paging = createPagination(count.rows[0].count, page, limit);

    let result = await selectCommentsByIdRecipe(id_recipe, paging);
    let data = result.rows;

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
      data,
      pagination: paging.response,
    });
  },

  postCommentsByIdRecipe: async (req, res) => {
    let { id_recipe, comment } = req.body;
    let id_user = req.user.uuid;

    if (!id_recipe || !id_user || !comment) {
      return res.status(400).json({
        code: 400,
        message: "id_recipe, id_user, and comment is required",
      });
    }

    //   check recipes
    let recipe = await selectRecipeById(id_recipe);
    let recipe_data = recipe.rows[0];

    if (!recipe_data) {
      return res.status(200).json({
        code: 200,
        message: "Recipes not found!",
        data: [],
      });
    }

    let data = { id_recipe, id_user, comment };

    let result = await insertCommentsByIdRecipe(data);

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
};

module.exports = commentsController;
