const jwt = require('jsonwebtoken');

const generateToken = (res, id) => {
  const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.DB_ENV === 'testing' ? '1d' : '7d',
  });
  res.cookie('token', token, {
    expires: new Date(Date.now() + expiration),
    secure: false, // set to true if your using https
    httpOnly: true,
  });

  return token;
};
module.exports = generateToken