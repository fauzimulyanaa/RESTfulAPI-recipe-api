const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");

router.get("/search", usersController.searchUsers);
router.get("/sort", usersController.UsersSortedByUsername);
router.get("/page", usersController.usersPage);

router.get("/:userId/recipe", usersController.getUserRecipes);
// CREATE NEW USERS
router.post("/", usersController.createNewUsers);

// READ USERS
router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUsersById);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
