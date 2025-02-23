import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  profilePic: { type: String, required: true },
  postImage: { type: String, required: true }, // Image URL
  caption: { type: String, required: true },
  fileUrl: { type: String }, // ✅ Added file URL (image/video)
  fileType: { type: String, enum: ["image", "video"] }, // ✅ Added file type (optional)
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
