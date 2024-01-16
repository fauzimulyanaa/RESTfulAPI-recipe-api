const express = require("express");

const { allCategory, getCategoryId, inputCategory, putCategory, deleteCategoryId } = require("../controllers/category");
const verifyToken = require("../middleware/auth");
const { isActivated } = require("../middleware/isActivated");
const { onlyAdmin } = require("../middleware/roleUsers");

const router = express.Router();

// All role
router.get("/", verifyToken, isActivated, allCategory);
router.get("/:id", verifyToken, isActivated, getCategoryId);

// Only admin
router.post("/", verifyToken, isActivated, onlyAdmin, inputCategory);
router.put("/:id", verifyToken, isActivated, onlyAdmin, putCategory);
router.delete("/:id", verifyToken, isActivated, onlyAdmin, deleteCategoryId);

module.exports = router;
