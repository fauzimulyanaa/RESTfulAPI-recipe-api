const express = require("express");
const router = express.Router();
const recipesController = require("../controller/recipes");
const usersController = require("../controller/users");

router.get("/category/:id", recipesController.getRecipesByCategory);
router.get("/search", recipesController.searchRecipesByCategory);
router.get("/detail", recipesController.searchRecipes);
router.get("/page", recipesController.recipesPage);

// CREATE RECIPES
router.post("/", recipesController.createNewRecipe);

// READ ALL RECIPES
router.get("/", recipesController.getAllRecipes);
// READ RECIPES BY ID
router.get("/:id", recipesController.recipeById);

// UPDATE
router.put("/:id", recipesController.updateRecipe);

// DELETE RECIPES BY ID
router.delete("/:id", recipesController.deleteRecipe);

module.exports = router;
