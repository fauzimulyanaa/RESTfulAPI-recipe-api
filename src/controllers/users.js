const bcrypt = require("bcrypt");
const { showAllUsers, countAll, showUserById, deleteUserById, updateUserById, selectMyAccount } = require("../models/users");
const createPagination = require("../utils/createPagination");
const cloudinary = require("../config/photo");

const usersController = {
  getAllUsers: async (req, res) => {
    // pagination
    let page = parseInt(req.query.page) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || "";
    let sort = req.query.sort;
    let count = await countAll(search);
    let paging = createPagination(count.rows[0].count, page, limit);

    let users = await showAllUsers(paging, search, sort);

    if (users.rows == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Success get data!",
      data: users.rows,
      pagination: paging.response,
    });
  },

  getUsersById: async (req, res) => {
    let id_user = req.params.id;

    let data = await showUserById(id_user);
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

  deleteUser: async (req, res) => {
    let id_user = req.params.id;

    let data = await showUserById(id_user);
    let result = data.rows[0];

    if (!result) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
      });
    }

    await deleteUserById(id_user);
    res.status(200).json({
      code: 200,
      message: "Success delete data!",
    });
  },

  updateUser: async (req, res) => {
    let id_user = req.params.id;
    let { name, phone_number } = req.body;

    //   Check user
    let user = await selectMyAccount(id_user);

    if (user.rowCount == 0) {
      return res.status(200).json({
        code: 200,
        message: "Data not found!",
        data: [],
      });
    }

    let data = user.rows[0];

    let newData = {
      id_user: data.id_user,
      name: name || data.name,
      email: data.email,
      phone_number: phone_number || data.phone_number,
      uuid: data.uuid,
      is_active: data.is_active,
    };

    // if not update password
    if (!req.body.password) {
      newData.password = data.password;
    }

    // if not update password
    if (req.body.password) {
      // hashing password with bcrypt
      let password = req.body.password;
      if (!password) {
        return res.status(400).json({
          code: 400,
          message: "password is required",
        });
      }
      let passwordHashed = await bcrypt.hash(password, 10);

      newData.password = passwordHashed;
    }

    // check photo
    if (!req.file) {
      if (req.isFileValid === undefined || req.isFileValid) {
        newData.photo = data.photo;
        let result = await updateUserById(newData);

        if (!result) {
          return res.status(404).json({
            code: 404,
            message: "Failed update data!",
          });
        }

        return res.status(200).json({
          code: 200,
          message: "Success update data!",
        });
      } else {
        return res.status(404).json({
          messsage: "failed update data, photo must be image file",
        });
      }
    }

    if (req.file) {
      if (!req.isFileValid) {
        return res.status(404).json({
          messsage: "failed update data, photo must be image file",
        });
      }

      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "recipes",
      });

      if (!imageUpload) {
        return res.status(400).json({ messsage: "upload photo failed" });
      }
      newData.photo = imageUpload.secure_url;

      let result = await updateUserById(newData);

      if (!result) {
        return res.status(404).json({
          code: 404,
          message: "Failed update data!",
        });
      }

      res.status(200).json({
        code: 200,
        message: "Success update data!",
      });
    }
  },
};

module.exports = usersController;
