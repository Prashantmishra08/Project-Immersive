import React, { useState } from "react";
import axios from "axios";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length || 0);
  const [isLiked, setIsLiked] = useState(post.likes.includes(localStorage.getItem("userId")));
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false); // ✅ Toggle state for comments

  // ✅ Handle Like/Unlike Functionality
  const handleLike = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/like/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setLikes(res.data.likes); // Set correct likes count
        setIsLiked(!isLiked); // Toggle Like state
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // ✅ Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/comment/${post._id}`,
        { comment: newComment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 201) {
        setComments(res.data.comments); // Update comment list
        setNewComment(""); // Clear input field
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4 max-w-md mx-auto">
      {/* User Info */}
      <div className="flex items-center p-4">
        <img src={post.profilePic} alt="profile pic" className="w-10 h-10 rounded-full" />
        <div className="ml-2">
          <p className="font-semibold">{post.username}</p>
        </div>
      </div>

      {/* Post Image */}
      <img src={post.postImage} alt="Post" className="w-full h-80 object-cover" />

      {/* Post Actions */}
      <div className="p-4">
        <p>{post.caption}</p>
        <div className="flex justify-between items-center mt-2">
          {/* Like Button */}
          <button className="flex items-center space-x-2" onClick={handleLike}>
            <span>{isLiked ? "💖" : "❤️"}</span>
            <span>{likes} Likes</span>
          </button>

          {/* Comment Button - Toggles Comment Section */}
          <button
            className="flex items-center space-x-2"
            onClick={() => setShowComments(!showComments)} // ✅ Toggle comments visibility
          >
            <span>💬</span>
            <span>{comments.length} Comments</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center space-x-2">
            <span>📤</span>
            <span>Share</span>
          </button>
        </div>

        {/* Comment Section (Only Visible When Toggled) */}
        {showComments && ( // ✅ Conditionally render comments
          <div className="mt-4 p-2 border rounded bg-gray-100">
            <h3 className="font-semibold">Comments</h3>

            {/* ✅ Fixed height with scroll for overflow */}
            <div className="max-h-[120px] overflow-y-auto space-y-2 p-2 bg-white rounded">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">No comments yet</p>
              ) : (
                comments.map((comment, index) => (
                  <p key={index} className="text-sm border-b pb-1">
                    <strong>{comment.username}: </strong> {comment.comment}
                  </p>
                ))
              )}
            </div>

            {/* Add Comment */}
            <form onSubmit={handleCommentSubmit} className="mt-2 flex">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="border rounded-l p-2 flex-grow"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
