import {Subscription} from "../models/followers.model.js"
import User from "../models/user.models.js"

const followUser = async (req, res) => {
    const { userName } = req.body     // jis ko follow krna hai (celebrity)

    console.log(userName)

    if (!userName?.trim()) {
        return res.status(400).send("username is missing")
    }

    const subscriberId = req.user._id  // jise follow krna hai(user) 

    try {
        // Check if the user to follow exists
        const targetUser = await User.findOne({ userName: userName.toLowerCase() })
        if (!targetUser) {
            return res.status(404).send("User not found in the db")
        }

        // Create a new subscription using the target user's _id
        const newSubscription = await Subscription.create({
            channel: targetUser._id,  // Use the target user's _id for the subscription
            subscriber: subscriberId,
        });

        return res.status(200).json({
            message: "Successfully followed the user",
            subscription: newSubscription,
        });
    } catch (error) {
        console.error("Error following user:", error); // Log the error for debugging
        return res.status(500).send("An error occurred while following the user")
    }
};
export default followUser
