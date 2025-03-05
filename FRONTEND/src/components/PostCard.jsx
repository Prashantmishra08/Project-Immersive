import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import useThemeStore from "../zustand/useThemeStore";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length || 0);
  const [isLiked, setIsLiked] = useState(post.likes.includes(localStorage.getItem("userId")));
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { authUser } = useAuthContext();
  const { isDark } = useThemeStore();

  const handleLike = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.status === 200) {
        setLikes(res.data.likes);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/comment/${post._id}`,
        { comment: newComment },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.status === 201) {
        setComments(res.data.comments);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div
      className={`relative shadow-xl rounded-xl p-5 max-w-md mx-auto border transition-all duration-300 ${
        isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
      }`}
    >
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post.userId?.avatar} alt="profile pic" className="w-12 h-12 rounded-full border-2 border-blue-400" />
          <div>
            <p className="font-semibold">{post.username}</p>
          </div>
        </div>
      </div>

      {/* Post Media */}
      <div className="mt-3 rounded-xl overflow-hidden shadow-md">
        {post.fileUrl ? (
          post.fileUrl.endsWith(".mp4") || post.fileUrl.endsWith(".webm") ? (
            <video controls className="w-full h-80 object-cover rounded-xl">
              <source src={post.fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.fileUrl} alt="Post" className="w-full h-80 object-cover rounded-xl transition-transform duration-300 hover:scale-105" />
          )
        ) : (
          <p className="text-center text-gray-500">No media available</p>
        )}
      </div>

      {/* Post Caption */}
      <div className={`mt-4 p-3 rounded-lg shadow-inner ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
        <p className="font-bold text-lg">{post.caption}</p>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full shadow-md">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        {/* Like Button */}
        <button 
          className={`flex items-center space-x-5 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            isLiked ? "bg-red-200 text-red-600 dark:bg-red-700 dark:text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-300 hover:text-red-700"
          }`}
          onClick={handleLike}
        >
          <span className="text-xl">{isLiked ? "💖" : "❤️"}</span>
          <span>{likes} Likes</span>
        </button>

        {/* Comment Button */}
        <button
          className="flex items-center space-x-5 px-4 py-2 bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-300 hover:text-blue-700 transform hover:scale-105 transition-all duration-300"
          onClick={() => setShowComments(!showComments)}
        >
          <span>💬</span>
          <span>{comments.length} Comments</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className={`mt-4 p-3 border rounded-xl ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"}`}>
          <h3 className="font-semibold">Comments</h3>

          {/* Scrollable Comment List */}
          <div className={`max-h-32 overflow-y-auto space-y-2 p-2 rounded-md shadow-sm ${isDark ? "bg-gray-700 text-gray-300" : "bg-white text-gray-900"}`}>
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
              className="border rounded-l p-2 flex-grow focus:ring focus:ring-blue-300 dark:bg-gray-900 dark:text-white"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;