const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access Denied: No Token Provided" });
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid Token Format" });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user data to request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(403).json({ error: "Invalid or Expired Token" });
  }
};
