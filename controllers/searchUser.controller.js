import User from "../models/user.models.js";
import mongoose from "mongoose";
import { Subscription } from "../models/followers.model.js";

const getSearchedUserProfile = async (req, res) => {
    try {
        const { userName, currentUserId } = req.query; // Current user ka ID frontend se aayega

        if (!userName) {
            return res.status(400).json({ error: "Username is required" });
        }

        console.log("Fetching profiles for:", userName);

        // Search users excluding the current user
        const users = await User.find({
            _id: { $ne: currentUserId }, // Exclude the logged-in user
            userName: { $regex: userName, $options: "i" } // Case-insensitive search
        }).select("fullName userName profession about avatar"); // Select only necessary fields

        return res.status(200).json({ users });

    } catch (error) {
        console.error("Error fetching user profiles:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getSearchedUserProfile;

