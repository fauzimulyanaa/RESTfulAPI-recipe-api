const express = require("express");
const { allRecipes, getRecipeById, showRecipeByIdUser, postRecipe, putRecipe, deleteRecipeId, myRecipes, getCountRecipesByUuid, showNewRecipe, showSuggestionRecipe } = require("../controllers/recipes");
const verifyToken = require("../middleware/auth");
const { isActivated } = require("../middleware/isActivated");
const { recipeOwner, usersAndAdmin, onlyAdmin } = require("../middleware/roleUsers");
const upload = require("../middleware/upload");
const router = express.Router();

// All role
router.get("/", allRecipes);
router.get("/detail/:id", getRecipeById);
router.get("/latest", showNewRecipe);
router.get("/suggestion", showSuggestionRecipe);
router.get("/:id", verifyToken, isActivated, showRecipeByIdUser);

// Only users and admin
router.post("/", verifyToken, isActivated, usersAndAdmin, upload.single("photo"), postRecipe);
router.get("/show/myrecipes", verifyToken, isActivated, usersAndAdmin, myRecipes);
router.get("/count/:id", verifyToken, isActivated, usersAndAdmin, getCountRecipesByUuid);

// Only recipe owner
router.put("/:id", verifyToken, isActivated, recipeOwner, upload.single("photo"), putRecipe);
router.delete("/:id", verifyToken, isActivated, recipeOwner, deleteRecipeId);

// delete recipe by admin
router.delete("/deleteByAdmin/:id", verifyToken, isActivated, onlyAdmin, deleteRecipeId);

module.exports = router;
