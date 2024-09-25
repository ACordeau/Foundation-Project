const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Unauthorized: Invalid token" });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }
}

function isManager(req, res, next) {
  if (req.user.role !== "manager") {
    return res
      .status(403)
      .json({ message: "Access Denied: Only managers allowed." });
  }

  next();
}

module.exports = {
  verifyToken,
  isManager,
};
