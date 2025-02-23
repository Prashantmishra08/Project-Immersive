import User from "../models/user.models.js";

const logOutUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // ✅ Invalidate token by removing it from the database
    await User.findOneAndUpdate({ accessToken: token }, { $unset: { accessToken: 1 } });

    // ✅ Clear the cookie
    return res.status(200)
      .clearCookie("accessToken", { httpOnly: true, secure: true })
      .json({ message: "Logout successful" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default logOutUser;
