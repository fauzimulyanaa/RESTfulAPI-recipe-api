const eventModel = require("../model/events");
const recipeModel = require("../model/recipes");

const postEvent = async (req, res) => {
  try {
    let { recipes_id, status } = req.body;
    let users_id = req.user.uuid;

    if (!recipes_id || !status || !users_id) {
      return res.status(400).json({
        code: 400,
        messsage: "id recipes, status, and id users are required!",
      });
    }

    // Check status
    if (status !== "bookmark" && status !== "like") {
      return res.status(400).json({
        code: 400,
        message: "Invalid status!",
        data: [],
      });
    }

    // Check if recipe exists
    let recipe = await recipeModel.getRecipeById(recipes_id);
    let recipe_data = recipe.rows[0];

    if (!recipe_data) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    // Check if bookmarked
    if (status === "bookmark") {
      let isBookmark = await eventModel.checkIsBookmark(recipes_id, users_id);
      let isBookmarked = isBookmark.rows;

      if (isBookmarked.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "Recipe has been bookmarked",
          data: [],
        });
      }
    }

    // Check if liked
    if (status === "like") {
      let isLike = await eventModel.checkIsLike(recipes_id, users_id);
      let isLiked = isLike.rows;

      if (isLiked.length > 0) {
        return res.status(400).json({
          code: 400,
          message: "Recipe has been liked",
          data: [],
        });
      }
    }

    let data = { recipes_id, users_id, status };
    let result = await eventModel.insertEvent(data);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Failed to input data!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success to input data!",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEvent = async (req, res) => {
  let event = await eventModel.selectAllEvent();
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
};

const deleteEventBookmark = async (req, res) => {
  let id = req.params.id;

  let data = await eventModel.selectEventById(id);
  let result = data.rows[0];

  if (!result) {
    return res.status(200).json({
      code: 200,
      message: "Data not found!",
      data: [],
    });
  }

  await eventModel.deleteBookmarkById(id);
  res.status(200).json({
    code: 200,
    message: "Success delete data!",
  });
};

const deleteEventLike = async (req, res) => {
  let id = req.params.id;

  let data = await eventModel.selectEventById(id);
  let result = data.rows[0];

  if (!result) {
    return res.status(200).json({
      code: 200,
      message: "Data not found!",
      data: [],
    });
  }

  await eventModel.deleteLikeById(id);
  res.status(200).json({
    code: 200,
    message: "Success delete data!",
  });
};
const getMyBookmark = async (req, res) => {
  let users_id = req.user.uuid;

  let bookmark = await eventModel.getBookmarkRecipesByUser(users_id);
  let result = bookmark.rows;

  if (result.length == 0) {
    return res.status(200).json({
      code: 200,
      message: "Data not found!",
      data: [],
    });
  }

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
};
const getMyLike = async (req, res) => {
  let users_id = req.user.uuid;

  let like = await eventModel.getLikedRecipesByUser(users_id);
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
};
const getCountLikedByIdRecipe = async (req, res) => {
  let id_recipe = req.params.id;

  // check recipes
  let recipe = await recipeModel.getRecipeById(id_recipe);
  let recipe_data = recipe.rows[0];

  if (!recipe_data) {
    return res.status(200).json({
      code: 200,
      message: "Data not found!",
      data: [],
    });
  }

  let result = await eventModel.selectCountLikedByIdRecipe(id_recipe);

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
};
const getCountBookmarkedByIdRecipe = async (req, res) => {
  let id_recipe = req.params.id;

  // check recipes
  let recipe = await recipeModel.getRecipeById(id_recipe);
  let recipe_data = recipe.rows[0];

  if (!recipe_data) {
    return res.status(200).json({
      code: 200,
      message: "Data not found!",
      data: [],
    });
  }

  let result = await eventModel.selectCountBookmarkedByIdRecipe(id_recipe);

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
};

module.exports = { postEvent, getEvent, deleteEventBookmark, deleteEventLike, getMyBookmark, getMyLike, getCountLikedByIdRecipe, getCountBookmarkedByIdRecipe };
