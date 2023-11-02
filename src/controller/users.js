const userModels = require("../model/users");
const recipeModel = require("../model/recipes");

const createNewUsers = async (req, res) => {
  try {
    const { username, password, email, full_name } = req.body;
    let data = { username, password, email, full_name };
    let result = await userModels.CreateUsers(data);
    res.status(200).json({ message: "Create new users successful", data: data });
  } catch (error) {
    res.status(500).json({ message: "Failed to create recipe", error: error.message });
  }
};

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
  const { id } = req.params;

  try {
    const user = await userModels.getUsersById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Get user by ID success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user by ID" });
  }
};

const getUserRecipes = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userRecipes = await userModels.getRecipesByUser(userId);
    res.json({
      message: "List of recipes created by users",
      data: userRecipes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user recipe list" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, full_name } = req.body;

    const users = await userModels.getUsersById(id);

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    let updatedData = {
      username: username || users.username,
      password: password || users.password,
      email: email || users.email,
      full_name: full_name || users.full_name,
    };

    const result = await userModels.updateUser(id, updatedData);
    res.status(200).json({ message: "Users updated successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await userModels.deleteUser(userId);

    res.status(200).json({ message: "User and associated recipes deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user and associated recipes" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const search = req.query.search;
    if (!search) {
      return res.status(400).json({ message: "Parameter require" });
    }

    const searchResults = await userModels.searchUser(search);
    if (searchResults.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({ message: "Pencarian berhasil", data: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal melakukan pencarian" });
  }
};

const UsersSortedByUsername = async (req, res) => {
  try {
    const { order } = req.query; // Mengambil parameter urutan dari permintaan

    if (!order || (order !== "asc" && order !== "desc")) {
      return res.status(400).json({ message: "Invalid order parameter" });
    }

    const users = await userModels.getUsersSortedByUsername(order);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ message: "Users sorted by username", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const usersPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const users = await userModels.getUsersPagination(page, limit);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ message: "Users retrieved successfully", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

module.exports = {
  createNewUsers,
  getAllUsers,
  getUsersById,
  updateUser,
  deleteUser,
  getUserRecipes,
  searchUsers,
  UsersSortedByUsername,
  usersPage,
};
