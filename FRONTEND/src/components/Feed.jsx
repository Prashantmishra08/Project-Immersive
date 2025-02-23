import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Feed = () => {
  const query = useQuery().get("search"); // Get search query from URL
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch posts from the backend on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/all");
        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ✅ Filter posts based on search query
  const filteredPosts = query
    ? posts.filter((post) => post.caption.toLowerCase().includes(query.toLowerCase()))
    : posts;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Reels</h1>

      <div className="container mx-auto py-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600">No matching posts found</p>
        ) : (
          filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;
