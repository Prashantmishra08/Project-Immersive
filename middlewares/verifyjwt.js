// import jwt from "jsonwebtoken";
// import User from "../models/user.models.js";

// export const verifyJwt = async (req, res, next) => {
//   try {
//     let token = req.cookies.accessToken;

//     if (!token && req.headers.authorization) {
//       const authHeader = req.headers.authorization.split(" ");
//       if (authHeader[0] === "Bearer") {
//         token = authHeader[1];
//       }
//     }

//     if (!token) {
//       return res.status(403).json({ message: "Access token is missing" });
//     }

//     // ✅ Verify token
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
//     // ✅ Check if token is still valid in the database
//     const user = await User.findById(decodedToken?._id).select("-password");
//     if (!user || user.accessToken !== token) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyJwt = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;
    
    // ✅ Check token in headers if not in cookies
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization.split(" ");
      if (authHeader[0] === "Bearer") {
        token = authHeader[1];
      }
    }

    console.log("🟡 Token received on backend:", token);

    if (!token) {
      console.error("🚨 Access Denied: No token provided");
      return res.status(403).json({ message: "Access token is missing" });
    }

    // ✅ Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("🔵 Decoded Token:", decodedToken);

    // ✅ Fetch User from Database
    const user = await User.findById(decodedToken?._id).select("-password");
    console.log("🟢 User found:", user);

    if (!user) {
      console.error("🚨 Invalid Token: User not found");
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;

    // req.user = {
    //   _id: user._id,
    //   username: user.userName,
    //   profilePic: user.avatar,
    //   email: user.email,
    //   profession: user.profession,
    //   about: user.about,
    //   interests: user.interests,
    // };
    console.log("✅ User added to request:", req.user);
    next();
  } catch (error) {
    console.error("🚨 JWT Error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
