const Pool = require("../config/db");

const insertEvent = async (data) => {
  const { recipes_id, users_id, status } = data;
  return new Promise((resolve, reject) => {
    Pool.query(`INSERT INTO event (recipes_id, users_id, status) VALUES (${recipes_id}, '${users_id}', '${status}')`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectAllEvent = async () => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectEventById = async (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE id=${id}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteBookmarkById = async (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM event WHERE id=${id} AND status='bookmark'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const deleteLikeById = async (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`DELETE FROM event WHERE id=${id} AND status='like'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectMyBookmark = async (users_id, paging) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT event.id, recipes.id_recipe, recipes.photo, recipes.title, recipes.ingredients, users.name AS author, category.name AS category, event.status, (SELECT COUNT(*) AS like FROM event WHERE recipes_id=recipes.id_recipe AND status='like'), (SELECT COUNT(*) AS bookmark FROM event WHERE recipes_id=recipes.id_recipe AND status='bookmark'), (SELECT COUNT(*) AS comments FROM comments WHERE id_recipe=recipes.id_recipe) FROM event JOIN recipes ON event.recipes_id = recipes.id_recipe JOIN users ON recipes.uuid = users.uuid JOIN category ON recipes.id_category = category.id_category WHERE event.users_id='${users_id}' AND event.status='bookmark' ORDER BY created_at DESC LIMIT ${paging.limit} OFFSET ${paging.offset}`,
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

const selectMyLike = async (users_id, paging) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT event.id, recipes.id_recipe, recipes.photo, recipes.title, recipes.ingredients, users.name AS author, category.name AS category, event.status, (SELECT COUNT(*) AS like FROM event WHERE recipes_id=recipes.id_recipe AND status='like'), (SELECT COUNT(*) AS bookmark FROM event WHERE recipes_id=recipes.id_recipe AND status='bookmark'), (SELECT COUNT(*) AS comments FROM comments WHERE id_recipe=recipes.id_recipe) FROM event JOIN recipes ON event.recipes_id = recipes.id_recipe JOIN users ON recipes.uuid = users.uuid JOIN category ON recipes.id_category = category.id_category WHERE event.users_id='${users_id}' AND event.status='like' ORDER BY created_at DESC LIMIT ${paging.limit} OFFSET ${paging.offset}`,
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

const countMyBookmark = async (users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM event WHERE users_id='${users_id}' AND status='bookmark'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const countMyLike = async (users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM event WHERE users_id='${users_id}' AND status='like'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const checkIsBookmark = async (recipes_id, users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE recipes_id='${recipes_id}' AND status='bookmark' AND users_id='${users_id}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const checkIsLike = async (recipes_id, users_id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE recipes_id='${recipes_id}' AND status='like' AND users_id='${users_id}'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const getIdOwnerEvent = async (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM event WHERE id=${id}`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectCountLikedByIdRecipe = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM event WHERE recipes_id=${id_recipe} AND status='like'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectCountBookmarkedByIdRecipe = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT COUNT(*) FROM event WHERE recipes_id=${id_recipe} AND status='bookmark'`, (err, result) => {
      if (!err) {
        return resolve(result);
      } else {
        return reject(err);
      }
    });
  });
};

const selectCountCommentsAndEventsByIdRecipe = async (id_recipe) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT COUNT(*) AS comments, (SELECT COUNT(*) AS like FROM event WHERE recipes_id=${id_recipe} AND status='like'), (SELECT COUNT(*) AS bookmark FROM event WHERE recipes_id=${id_recipe} AND status='bookmark') FROM comments  WHERE id_recipe=${id_recipe}`,
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

module.exports = {
  insertEvent,
  selectAllEvent,
  selectEventById,
  deleteBookmarkById,
  selectMyBookmark,
  selectMyLike,
  countMyBookmark,
  countMyLike,
  deleteLikeById,
  checkIsBookmark,
  checkIsLike,
  getIdOwnerEvent,
  selectCountLikedByIdRecipe,
  selectCountBookmarkedByIdRecipe,
  selectCountCommentsAndEventsByIdRecipe,
};
