import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create uploads directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage }).single("avatar"); // Accept a single file upload with field name "avatar"

// 🔹 Function to update user profile (without profile picture)
export const updateProfile = async (req, res) => {
    const { fullName, email, profession, about, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update non-password fields
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (profession) user.profession = profession;
        if (about) user.about = about;

        // Handle password change (Only if both currentPassword & newPassword are provided)
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Save changes
        await user.save();

        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// 🔹 Function to update profile picture separately
export const updateProfilePicture = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload failed" });
        }

        const userId = req.user._id;

        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update user's profile picture
            user.avatar = `/uploads/${req.file.filename}`;
            await user.save();

            return res.status(200).json({ 
                message: "Profile picture updated successfully", 
                avatar: user.avatar 
            });
        } catch (error) {
            console.error("Error updating profile picture:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
};
