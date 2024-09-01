const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment

// Middleware to verify JWT token from the cookie
const authMiddleware = (req, res, next) => {
  const token = req.body.token; // Retrieve token from cookies

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    // Attach user information to the request object for further use
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
