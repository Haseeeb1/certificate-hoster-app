const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
