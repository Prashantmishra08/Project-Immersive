import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyJwt = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization.split(" ");
      if (authHeader[0] === "Bearer") {
        token = authHeader[1];
      }
    }

    if (!token) {
      return res.status(403).json({ message: "Access token is missing" });
    }

    // ✅ Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // ✅ Check if token is still valid in the database
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user || user.accessToken !== token) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
