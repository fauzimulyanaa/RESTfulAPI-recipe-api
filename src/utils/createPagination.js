module.exports = (count, page = 1, limit = 10) => {
  let offset = 0;

  // page falsy
  if (!page || page < 1 || !/[\d]/.test(page)) {
    page = 1;
  }
  if (typeof page === "string") {
    page = parseInt(page, 10);
  }

  // limit falsy
  if (!limit || limit < 1 || !/[\d]/.test(limit)) {
    limit = 10;
  }
  if (typeof limit === "string") {
    limit = parseInt(limit, 10);
  }

  const response = {
    currentPage: page,
    dataPerPage: limit,
    totalPage: Math.ceil(count / limit),
    totalRows: parseInt(count),
  };

  offset = (page - 1) * limit;

  return {
    limit,
    offset,
    response,
  };
};
