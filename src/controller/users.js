const userModels = require("../model/users");
const recipeModel = require("../model/recipes");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/photo");

const getAllUsers = async (req, res) => {
  try {
    const data = await userModels.getAllUsers();
    res.status(200).json({
      message: "Get all users success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user data" });
  }
};

const getUsersById = async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await userModels.getUsersById(uuid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Get user by ID success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user by ID" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { uuid } = req.params;

    const users = await userModels.getUsersById(uuid);
    console.log(users);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedData = {
      uuid: users.uuid,
      username: users.username,
      email: users.email,
      password: users.password,
    };

    if (username) {
      updatedData.username = username;
    }

    if (email) {
      updatedData.email = email;
    }

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updatedData.password = hashedPassword;
    }

    if (!req.file) {
      updatedData.photo_user = users.photo_user;

      let result = await userModels.updateUser(updatedData);

      if (!result) {
        return res.status(404).json({ messsage: "failed update data" });
      }
      return res.status(200).json({ messsage: "success update data" });
    }

    if (req.file) {
      if (!req.isFileValid) {
        return res.status(404).json({
          messsage: "failed update data, photo must be image file",
        });
      }
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "photo_users",
      });

      if (!imageUpload) {
        return res.status(400).json({ messsage: "upload photo failed" });
      }
      updatedData.photo_user = imageUpload.secure_url;
    }

    const result = await userModels.updateUser(updatedData);

    res.status(200).json({ message: "User updated successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
// const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     await userModels.deleteUser(userId);

//     res.status(200).json({ message: "User and associated recipes deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to delete user and associated recipes" });
//   }
// };

// const searchUsers = async (req, res) => {
//   try {
//     const search = req.query.search;
//     if (!search) {
//       return res.status(400).json({ message: "Parameter require" });
//     }

//     const searchResults = await userModels.searchUser(search);
//     if (searchResults.length === 0) {
//       return res.status(404).json({ message: "Data not found" });
//     }

//     res.status(200).json({ message: "Pencarian berhasil", data: searchResults });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Gagal melakukan pencarian" });
//   }
// };

module.exports = {
  getAllUsers,
  getUsersById,
  updateUser,
  // deleteUser,
  // getUserRecipes,
  // searchUsers,
};
