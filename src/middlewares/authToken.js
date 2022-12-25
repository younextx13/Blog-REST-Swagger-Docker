const jwt = require('jsonwebtoken');
const getRegisteredUsers = require('../helpers/getRegisteredUsers');

const secret = process.env.JWT_SECRET || 'secretJWT';

const tokenAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
    const { emails } = await getRegisteredUsers();
    req.email = decoded.email;

    if (!emails.includes(decoded.email)) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: error });
  }

  next();
};

module.exports = tokenAuth;