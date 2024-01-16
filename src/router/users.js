const express = require("express");
const { getAllUsers, getUsersById, deleteUser, updateUser } = require("../controllers/users");
const verifyToken = require("../middleware/auth");
const { mySelf } = require("../middleware/roleUsers");
const { isActivated } = require("../middleware/isActivated");
const upload = require("../middleware/upload");

const router = express.Router();

// All role
router.get("/", verifyToken, isActivated, getAllUsers);
router.get("/:id", verifyToken, isActivated, getUsersById);

// Only owner
router.put("/:id", verifyToken, isActivated, mySelf, upload.single("photo"), updateUser);
router.delete("/:id", verifyToken, isActivated, mySelf, deleteUser);

module.exports = router;
