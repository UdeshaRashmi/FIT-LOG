const User = require('../models/User');

exports.findOrCreateDemo = async () => {
  const email = 'demo@fitlog.com';
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name: 'Demo User', email, password: 'demo123' });
  }
  return user;
};
