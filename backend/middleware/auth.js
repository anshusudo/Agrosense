const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded; // { userId }

    next(); // allow request
  } catch (error) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
