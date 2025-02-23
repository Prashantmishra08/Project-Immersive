import User from "../models/user.models.js";
import mongoose from "mongoose";
import { Subscription } from "../models/followers.model.js";

const getSearchedUserProfile = async (req, res) => {
    try {
        const { userName } = req.query;
        if (!userName) {
            return res.status(400).json({ error: "Username is required" });
        }

        console.log("Fetching profile for:", userName);

        const user = await User.findOne({ userName: { $regex: `^${userName}$`, $options: "i" } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        // Fetch followers and following details
        const subscriptions = await Subscription.find({ channel: userId }).populate("subscriber", "userName fullName avatar");
        const following = await Subscription.find({ subscriber: userId }).populate("channel", "userName fullName avatar");

        return res.status(200).json({
            message: "User profile fetched successfully",
            user: {
                fullName: user.fullName,
                userName: user.userName,
                email: user.email,
                profession: user.profession,
                about: user.about,
                avatar: user.avatar,
                subscribersCount: subscriptions.length,
                followingCount: following.length,
                subscribers: subscriptions.map(sub => sub.subscriber),
                following: following.map(sub => sub.channel),
            }
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getSearchedUserProfile;
