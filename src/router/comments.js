const express = require("express");

const verifyToken = require("../middleware/auth");
const { isActivated } = require("../middleware/isActivated");
const { getAllComments, getCommentsByIdRecipe, postCommentsByIdRecipe } = require("../controllers/comments");

const router = express.Router();

router.get("/", verifyToken, isActivated, getAllComments);
router.get("/:id", verifyToken, isActivated, getCommentsByIdRecipe);
router.post("/", verifyToken, isActivated, postCommentsByIdRecipe);

module.exports = router;
