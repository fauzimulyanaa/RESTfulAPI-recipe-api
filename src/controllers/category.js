const { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory } = require("../models/category");

const categoryController = {
  allCategory: async (req, res) => {
    let data = await getAllCategory();
    let result = data.rows;

    if (!result) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      result,
    });
  },

  getCategoryId: async (req, res) => {
    let id_category = req.params.id;
    let data = await getCategoryById(id_category);

    let result = data.rows[0];

    if (!result) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }
    res.status(200).json({
      code: 200,
      message: "Success get data!",
      result,
    });
  },

  inputCategory: async (req, res) => {
    let { name } = req.body;
    if (!name) {
      return res.status(400).json({
        code: 400,
        message: "name is required",
      });
    }

    let data = { name };
    let result = await createCategory(data);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Failed input data!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success input data!",
      data,
    });
  },

  putCategory: async (req, res) => {
    let id_category = req.params.id;
    let { name } = req.body;

    let category_data = await getCategoryById(id_category);

    if (category_data.rowCount == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    let data = category_data.rows[0];

    let newData = {
      id_category: data.id_category,
      name: name || data.name,
    };
    let result = await updateCategory(newData);

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Failed update data!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success update data!",
      newData,
    });
  },

  deleteCategoryId: async (req, res) => {
    let id_category = req.params.id;

    let data = await getCategoryById(id_category);
    let result = data.rows[0];

    if (!result) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }
    await deleteCategory(id_category);
    res.status(200).json({
      code: 200,
      message: "Success delete data!",
    });
  },
};

module.exports = categoryController;
