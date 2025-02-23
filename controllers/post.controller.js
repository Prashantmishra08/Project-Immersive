import Post from  "../models/post.model.js"
import User from  "../models/user.models.js"
import multer from "multer";

const upload = multer({ dest: "uploads/" }); // ✅ Temporary storage for uploaded files
export const createPost = async (req, res) => {
  try {
    const { userId, username, avatar, caption, fileUrl, fileType } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }

    const newPost = new Post({
      userId,
      username,
      avatar,
      postImage: fileUrl,  // ✅ Ensure fileUrl is stored here
      fileUrl,
      fileType,
      caption,
    });

    await newPost.save();
    res.status(201).json({ success: true, message: "Post created", newPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};





// 📌 Fetch All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "userName avatar"); // Fetch user details

    res.status(200).json({ success: true, posts }); // Corrected: `posts` instead of `postsArray`
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};


// 📌 Fetch User's Posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// 📌 Like a Post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ message: "Post like updated", likes: post.likes.length }); // ✅ Only return count
  } catch (error) {
    res.status(500).json({ message: "Failed to like post", error });
  }
};


// 📌 Comment on a Post
export const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      userId,
      username: user.userName,
      comment,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: "Comment added", comments: post.comments }); // ✅ Return updated comments
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error });
  }
};

