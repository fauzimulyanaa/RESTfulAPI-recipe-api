const express = require("express");

const router = express.Router();

const auth = require("./auth");
const users = require("./users");
const recipes = require("./recipes");
const category = require("./category");
const event = require("./event");
const comments = require("./comments");

router.use("/auth", auth);
router.use("/users", users);
router.use("/recipe", recipes);
router.use("/category", category);
router.use("/event", event);
router.use("/comments", comments);

module.exports = router;
