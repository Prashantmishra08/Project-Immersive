import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Actor
    type: { type: String, enum: ["follow", "like", "comment"], required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: false },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
