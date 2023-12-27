const express = require("express");
const router = express.Router();
const eventController = require("../controller/events");
const { Protect } = require("../middleware/private");

router.post("/", Protect, eventController.postEvent);
router.get("/", Protect, eventController.getEvent);
router.delete("/bookmark/:id", Protect, eventController.deleteEventBookmark);
router.delete("/like/:id", Protect, eventController.deleteEventLike);
router.get("/bookmarked/", Protect, eventController.getMyBookmark);
router.get("/liked/", Protect, eventController.getMyLike);
router.get("/count-liked/:id", Protect, eventController.getCountLikedByIdRecipe);
router.get("/count-bookmarked/:id", Protect, eventController.getCountBookmarkedByIdRecipe);

module.exports = router;
