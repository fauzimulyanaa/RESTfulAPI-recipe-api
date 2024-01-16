const express = require("express");
const verifyToken = require("../middleware/auth");
const { isActivated } = require("../middleware/isActivated");
const { postEvent, getEvent, deleteEventBookmark, deleteEventLike, getMyBookmark, getMyLike, getCountLikedByIdRecipe, getCountBookmarkedByIdRecipe, getCountCommentsAndEventsByIdRecipe } = require("../controllers/event");
const { eventOwner } = require("../middleware/roleUsers");
const router = express.Router();

router.post("/", verifyToken, isActivated, postEvent);
router.get("/", verifyToken, isActivated, getEvent);
router.delete("/bookmark/:id", verifyToken, isActivated, eventOwner, deleteEventBookmark);
router.delete("/like/:id", verifyToken, isActivated, eventOwner, deleteEventLike);
router.get("/bookmarked/", verifyToken, isActivated, getMyBookmark);
router.get("/liked/", verifyToken, isActivated, getMyLike);
router.get("/count-liked/:id", verifyToken, isActivated, getCountLikedByIdRecipe);
router.get("/count-bookmarked/:id", verifyToken, isActivated, getCountBookmarkedByIdRecipe);
router.get("/count-status-recipes/:id", verifyToken, isActivated, getCountCommentsAndEventsByIdRecipe);

module.exports = router;
