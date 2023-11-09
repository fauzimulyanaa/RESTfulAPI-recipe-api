const express = require("express");
const router = express.Router();
const recipesController = require("../controller/recipes");

const { Protect } = require("../middleware/private");
const upload = require("../middleware/upload");

router.get("/detail", Protect, recipesController.getRecipesDetail);

// CREATE RECIPES
router.post("/create", Protect, upload.single("photo_recipes"), recipesController.createNewRecipe);
router.get("/my-recipe", Protect, recipesController.getRecipesUser);
router.get("/:id", Protect, recipesController.getRecipeById);

// READ ALL RECIPES
router.get("/", Protect, recipesController.getAllRecipes);

// UPDATE
router.patch("/update-recipe/:id", Protect, upload.single("photo_recipes"), recipesController.updateRecipe);

// DELETE RECIPES BY ID
router.delete("/delete-recipe/:id", Protect, recipesController.deleteRecipe);

module.exports = router;
