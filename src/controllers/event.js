const {
  insertEvent,
  selectAllEvent,
  deleteBookmarkById,
  deleteLikeById,
  selectEventById,
  selectMyBookmark,
  selectMyLike,
  countMyBookmark,
  countMyLike,
  checkIsBookmark,
  checkIsLike,
  selectCountLikedByIdRecipe,
  selectCountBookmarkedByIdRecipe,
  selectCountCommentsAndEventsByIdRecipe,
} = require("../models/event");
const { selectRecipeById } = require("../models/recipes");
const createPagination = require("../utils/createPagination");

const eventController = {
  postEvent: async (req, res) => {
    let { recipes_id, status } = req.body;
    let users_id = req.user.uuid;

    if (!recipes_id || !status || !users_id) {
      return res.status(400).json({
        code: 400,
        messsage: "id recipes, status and id users is required!",
      });
    }

    // check status
    if (status !== "bookmark" && status !== "like") {
      return res.status(400).json({
        code: 400,
        message: "status invalid!",
        data: [],
      });
    }

    // check recipes
    let recipe = await selectRecipeById(recipes_id);
    let recipe_data = recipe.rows[0];

    if (!recipe_data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    //check is bookmarked
    if (status == "bookmark") {
      let isBookmark = await checkIsBookmark(recipes_id, users_id);
      let isBookmarked = isBookmark.rows;

      console.log(isBookmarked);

      if (isBookmarked.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "recipes has been bookmarked",
          data: [],
        });
      }
    }

    //check is liked
    if (status == "like") {
      let isLike = await checkIsLike(recipes_id, users_id);
      let isLiked = isLike.rows;

      if (isLiked.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "recipes has been liked",
          data: [],
        });
      }
    }

    let data = { recipes_id, users_id, status };
    let result = await insertEvent(data);

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

  getEvent: async (req, res) => {
    let event = await selectAllEvent();
    let data = event.rows;

    if (data.length == 0) {
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

  deleteEventBookmark: async (req, res) => {
    let id = req.params.id;

    let data = await selectEventById(id);
    let result = data.rows[0];

    if (!result) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    await deleteBookmarkById(id);
    res.status(200).json({
      code: 200,
      message: "Success delete data!",
    });
  },

  deleteEventLike: async (req, res) => {
    let id = req.params.id;

    let data = await selectEventById(id);
    let result = data.rows[0];

    if (!result) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    await deleteLikeById(id);
    res.status(200).json({
      code: 200,
      message: "Success delete data!",
    });
  },

  getMyBookmark: async (req, res) => {
    let users_id = req.user.uuid;

    //   pagination
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let count = await countMyBookmark(users_id);
    let paging = createPagination(count.rows[0].count, page, limit);

    let bookmark = await selectMyBookmark(users_id, paging);
    let result = bookmark.rows;

    if (result.length == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    // change items ingredients with split
    result.forEach((items, i) => {
      let ingredients = items.ingredients.split(",");
      result[i].ingredients = ingredients;
    });

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result,
      pagination: paging.response,
    });
  },

  getMyLike: async (req, res) => {
    let users_id = req.user.uuid;

    //   pagination
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let count = await countMyLike(users_id);
    let paging = createPagination(count.rows[0].count, page, limit);

    let like = await selectMyLike(users_id, paging);
    let result = like.rows;

    if (result.length == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    // change items ingredients with split
    result.forEach((items, i) => {
      let ingredients = items.ingredients.split(",");
      result[i].ingredients = ingredients;
    });

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result,
      pagination: paging.response,
    });
  },

  getCountLikedByIdRecipe: async (req, res) => {
    let id_recipe = req.params.id;

    // check recipes
    let recipe = await selectRecipeById(id_recipe);
    let recipe_data = recipe.rows[0];

    if (!recipe_data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    let result = await selectCountLikedByIdRecipe(id_recipe);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Failed get data!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result.rows,
    });
  },

  getCountCommentsAndEventsByIdRecipe: async (req, res) => {
    let id_recipe = req.params.id;

    // check recipes
    let recipe = await selectRecipeById(id_recipe);
    let recipe_data = recipe.rows[0];

    if (!recipe_data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    let result = await selectCountCommentsAndEventsByIdRecipe(id_recipe);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Failed get data!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result.rows,
    });
  },

  getCountBookmarkedByIdRecipe: async (req, res) => {
    let id_recipe = req.params.id;

    // check recipes
    let recipe = await selectRecipeById(id_recipe);
    let recipe_data = recipe.rows[0];

    if (!recipe_data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    let result = await selectCountBookmarkedByIdRecipe(id_recipe);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Failed get data!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: result.rows,
    });
  },
};

module.exports = eventController;
