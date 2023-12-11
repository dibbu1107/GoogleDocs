const jwt = require("jsonwebtoken");

// Middleware function to authenticate the JWT token in the request header
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  // If no token is present, respond with a 401 Unauthorized status and a message
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Verify the token using the secret key
  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    // If the token is successfully verified, attach the user information to the request object
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
