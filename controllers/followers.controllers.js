import mongoose from "mongoose";
import User from "../models/user.models.js";
import { Subscription } from "../models/followers.model.js";

const getUserChannelProfile = async (req, res) => {
    try {
        console.log("Incoming Request:", req.user);

        if (!req.user || !req.user.userName) {
            return res.status(400).send("User is not authenticated or username is missing");
        }

        const userName = req.user.userName.toLowerCase();
        console.log("Fetching user profile for:", userName);
        const userId = new mongoose.Types.ObjectId(req.user._id);  

        if (!userName?.trim()) {
            return res.status(400).send("Username is missing");
        }

        const channel = await User.aggregate([
            {
                $match: { userName: { $regex: `^${userName}$`, $options: "i" } }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                }
            },
            {
                $addFields: {
                    subscribersCount: { $size: "$subscribers" },
                    channelsSubscribedToCount: { $size: "$subscribedTo" },
                    isSubscribed: {
                        $cond: {
                            if: { $in: [userId, "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    },
                    subscriberList: "$subscribers.subscriber",
                    subscribedToList: "$subscribedTo.channel"
                }
            },
            {
                $project: {
                    fullName: 1,
                    userName: 1,
                    email: 1,
                    profession: 1,
                    about: 1,
                    avatar: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    subscriberList: 1,
                    subscribedToList: 1
                }
            }
        ]);

        if (!channel?.length) {
            return res.status(404).send("Channel does not exist");
        }

        // Fetch user details for subscribers
        const subscriberDetails = await User.find(
            { _id: { $in: channel[0].subscriberList } },
            "userName fullName avatar"
        );

        const subscribedToDetails = await User.find(
            { _id: { $in: channel[0].subscribedToList } },
            "userName fullName avatar"
        );

        return res.status(200).json({
            message: "User channel fetched successfully",
            channel: {
                ...channel[0],
                subscribers: subscriberDetails,
                subscribedTo: subscribedToDetails,
            }
        });

    } catch (error) {
        console.error("Error fetching user channel:", error);
        return res.status(500).send("Internal Server Error");
    }
};

export default getUserChannelProfile;
