const { getUserFromToken, sanitizeUser } = require('../service/auth');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user no longer exists.' });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;
