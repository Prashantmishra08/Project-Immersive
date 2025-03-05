import jwt from "jsonwebtoken"

const verifyAdmin = (req, res, next) => {
  console.log("Headers:", req.headers);  // ✅ Check headers
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // ✅ Check token payload
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Not an admin" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid Token:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default verifyAdmin;
