import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// ✅ Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images and videos are allowed!"), false);
        }
    }
});

// ✅ Middleware Order Matters (multer should come before JSON parsing)
const uploadPost = async (req, res) => {
    try {
        console.log("📩 Received FormData:", req.body);
        console.log("📸 File Info:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const { caption, profilePic, username } = req.body;

        const newPost = {
            caption,
            profilePic,
            username,
            fileUrl: `/uploads/${req.file.filename}`
        };

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
};


export default uploadPost;
