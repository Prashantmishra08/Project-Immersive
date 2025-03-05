import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  profilePic: { type: String, required: true },
  postImage: { type: String }, // 
  caption: { type: String, required: true },
  fileUrl: { type: String, required: true }, 
  fileType: { 
    type: String, 
    enum: ["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/mov"], 
    required: true 
  },
  tags: [{ type: String }], 
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
