import { Subscription } from "../models/followers.model.js"
import User from "../models/user.models.js" // Ensure you import the User model

const unfollowUser = async (req, res) => {
    const { userName } = req.body // Username of the user to unfollow

    if (!userName?.trim()) {
        return res.status(400).send("username is missing")
    }

    const subscriberId = req.user._id // The ID of the user who is unfollowing

    try {
        // Find the user to unfollow
        const targetUser = await User.findOne({ userName: userName.toLowerCase() })
        if (!targetUser) {
            return res.status(404).send("User not found")
        }

        // Remove the subscription using the target user's _id
        const result = await Subscription.findOneAndDelete({
            channel: targetUser._id, // Use the target user's _id for the subscription
            subscriber: subscriberId,
        })

        if (!result) {
            return res.status(404).send("You are not following this user")
        }

        return res.status(200).json({
            message: "Successfully unfollowed the user",
        })
    } catch (error) {
        console.error("Error unfollowing user:", error) // Log the error for debugging
        return res.status(500).send("An error occurred while unfollowing the user")
    }
}

export default unfollowUser

