const jwt = require('jsonwebtoken');

const secret = 'MySecretPassword';

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) { return res.status(401).json({ message: 'missing auth token' }); }

  try {
    const decoded = jwt.verify(token, secret);

    res.role = decoded.role;
    res.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};