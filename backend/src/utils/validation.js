// placeholder validation helpers
exports.isEmail = (value) => /\S+@\S+\.\S+/.test(value);

exports.requireFields = (obj, fields) => {
  const missing = fields.filter(f => !(f in obj) || obj[f] === '');
  return missing;
};
