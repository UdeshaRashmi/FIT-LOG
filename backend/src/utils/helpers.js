exports.paginate = (query, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

exports.safeJson = (obj) => JSON.parse(JSON.stringify(obj));
