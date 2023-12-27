const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");
const { Protect } = require("../middleware/private");
const upload = require("../middleware/upload");

// router.get("/search", usersController.searchUsers);

// // CREATE NEW USERS

// // READ USERS
router.get("/", usersController.getAllUsers);

router.get("/:uuid", usersController.getUsersById);

router.patch("/update-user/:uuid", Protect, upload.single("photo_user"), usersController.updateUser);
// router.delete("/:id", usersController.deleteUser);

module.exports = router;
