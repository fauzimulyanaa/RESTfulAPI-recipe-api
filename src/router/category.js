const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");

router.delete("/:id", categoryController.deleteCategory);
// CREATE CATEGORY
router.post("/", categoryController.createNewCategory);

// GET ALL CATEGORY
router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.categoryById);
router.patch("/:id", categoryController.updateCategory);

module.exports = router;
