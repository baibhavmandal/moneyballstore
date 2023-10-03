import jwt from "jsonwebtoken";

// Middleware function to verify admin tokens
function verifyAdminToken(req, res, next) {
  try {
    // Get the token from the request headers or query parameters (you can choose either method)
    const token = req.headers.authorization || req.query.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication failed: No token provided" });
    }

    // Verify the token using your secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Authentication failed: Invalid token" });
      }

      // Check if the decoded payload contains admin-specific information
      if (!decoded.adminId || !decoded.mobileNumber) {
        return res
          .status(401)
          .json({ message: "Authentication failed: Invalid token data" });
      }

      // Attach the decoded data to the request object for later use
      req.adminId = decoded.adminId;
      req.mobileNumber = decoded.mobileNumber;

      // Continue to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export { verifyAdminToken };
