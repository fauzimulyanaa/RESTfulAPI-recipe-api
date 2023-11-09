const categoryModel = require("../model/category");
const recipeModel = require("../model/recipes");

const createNewCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let data = { name };
    let result = await categoryModel.postCategory(data);
    res.status(200).json({ message: "Create new Category successful", data: data });
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const data = await categoryModel.getAllCategory();
    res.status(200).json({
      message: "Get all category success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get category" });
  }
};

const categoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Get category by ID success", data: category });
  } catch (error) {
    res.status(500).json({ message: "Failed to get category by ID" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let updatedData = {
      name: name || category.name,
    };

    const result = await categoryModel.patchCategory(id, updatedData);
    res.status(200).json({ message: "Category updated successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const recipesUsingCategory = await recipeModel.getRecipesByCategory(id);

    if (recipesUsingCategory.length > 0) {
      return res.status(400).json({ message: "Category is still being used in recipes" });
    }

    const deleted = await categoryModel.deleteCategory(id);

    if (deleted) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

module.exports = {
  createNewCategory,
  getAllCategory,
  categoryById,
  updateCategory,
  deleteCategory,
};
