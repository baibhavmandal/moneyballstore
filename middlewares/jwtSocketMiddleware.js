import jwt from "jsonwebtoken";

const jwtSocketMiddleware = (socket, next) => {
  const token = socket.handshake.auth.crazygames_auth;

  if (!token) {
    return next(new Error("Access denied. No token provided."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.decoded = decoded; // Attach user info to the socket object
    next(); // Continue to the next middleware or connection
  } catch (error) {
    return next(new Error("Invalid token."));
  }
};

export default jwtSocketMiddleware;
