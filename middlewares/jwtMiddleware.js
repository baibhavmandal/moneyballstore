// jwtMiddleware.js
import jwt from "jsonwebtoken";

const jwtMiddleware = (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded; // Attach user info to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

export default jwtMiddleware;
