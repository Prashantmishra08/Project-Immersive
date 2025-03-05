import User from "../models/user.models.js"

// ye function jo users message k sidebar mein show honge unhe dikhaega
export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getConversations = async (req, res) => {
	try {
		const userId = req.user._id;

		// ✅ Fetch conversations where the user is a participant
		const conversations = await Conversation.find({
			participants: userId,
		}).populate("participants", "username email"); // Fetch user details

		if (!conversations) {
			return res.status(404).json({ error: "No conversations found" });
		}

		res.status(200).json(conversations);
	} catch (error) {
		console.error("🚨 Error fetching conversations:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

