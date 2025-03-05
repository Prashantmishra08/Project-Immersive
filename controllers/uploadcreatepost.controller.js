import mongoose from "mongoose";
import User from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";
import express from "express";
import fileUpload from "express-fileupload";
import Post from "../models/post.model.js";

const app = express();
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })); // ✅ Temp files allow direct upload

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Upload Post Route
export const uploadCreatePost = async (req, res) => {
  try {
    console.log("Incoming Request:", req.user);
    if (!req.user || !req.user.userName || !req.user._id) {
      return res.status(400).json({ message: "User authentication failed or missing data" });
  }
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const file = req.files.file; // ✅ Get uploaded file
    const { caption, tags } = req.body;

    // ✅ Allowed file types
    const validFileTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/mov"];
    if (!validFileTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: `Invalid file type! Allowed: ${validFileTypes.join(", ")}` });
    }

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      folder: "uploads",
    });
    const fileType = file.mimetype;

    console.log("✅ Upload Successful:", result.secure_url);

   // ✅ Convert tags into an array (if it's a string)
   const tagArray = typeof tags === "string" ? tags.split(",").map(tag => tag.trim()) : [];

  //  const username = req.user.userName.trim().toLowerCase();

  //  const profilePic = req.user.avatar;

   const userId = new mongoose.Types.ObjectId(req.user._id);

   // Create Post in DB
   const newPost = new Post({
       userId,
       username: req.user.userName,
       profilePic:req.user.avatar,
       caption,
       fileUrl: result.secure_url,
       fileType,  // ✅ Save fileType
       tags: tagArray,
   });

   await newPost.save();
   res.status(201).json({ message: "Post created successfully!", post: newPost });
} catch (error) {
   console.error("Error Creating Post:", error);
   res.status(500).json({ message: "Something went wrong!", error: error.message });
}
};

// 🔹 Export the function
// export default uploadCreatePost;
