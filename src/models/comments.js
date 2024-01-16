const Pool = require("../config/db");

const selectAllComments = async () => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT comments.id_comment, comments.id_recipe, comments.id_user, users.photo, users.name AS commenter, (SELECT COUNT(*) AS total_recipes FROM recipes WHERE uuid=comments.id_user), comments.commentar, comments.created_at FROM comments JOIN users ON comments.id_user=users.uuid ORDER BY created_at DESC`,
      (err, result) => {
        if (!err) {
          return resolve(result);
        } else {
          return reject(err);
        }
      }
    );
  });
};

const selectCommentsByIdRecipe = async (id_recipe, paging) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT comments.id_comment, comments.id_recipe, comments.id_user, users.photo, users.name AS commenter, (SELECT COUNT(*) AS total_recipes FROM recipes WHERE uuid=comments.id_user), comments.commentar, comments.created_at FROM comments JOIN users ON comments.id_user=users.uuid WHERE id_recipe=${id_recipe} ORDER BY created_at DESC LIMIT ${paging.limit} OFFSET ${paging.offset}`,
      (err, result) => {
        if (!err) {
          return resolve(result);
        } else {
          return reject(err);
        }
      }
    );
  });
};

const insertCommentsByIdRecipe = async (data) => {
  const { id_recipe, id_user, comment } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`INSERT INTO comments (id_recipe, id_user, commentar) VALUES (${id_recipe}, '${id_user}', '${comment}')`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const countCommentsByIdRecipe = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM comments WHERE id_recipe=${id_recipe}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

module.exports = { selectAllComments, selectCommentsByIdRecipe, insertCommentsByIdRecipe, countCommentsByIdRecipe };
