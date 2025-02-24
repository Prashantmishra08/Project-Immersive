const adminProtect = async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access Denied" });
    }
    next();
  };
  
  export default adminProtect;
  