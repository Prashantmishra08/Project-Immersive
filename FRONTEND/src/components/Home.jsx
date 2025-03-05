import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useThemeStore from "../zustand/useThemeStore";
import LeftSidebar from "./LeftSidebar.jsx";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Home = () => {
  const query = useQuery().get("search");
  const [posts, setPosts] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isDark } = useThemeStore();
  const [userName, setUserName] = useState("User");
  const [fullName, setFullName] = useState("User");

  // Fetch User Interests and Name
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", {
          withCredentials: true,
        });
        if (res.data.success) {
          setUserInterests(res.data.user.interests || []);
          setUserName(res.data.user.userName || "User");
          setFullName(res.data.user.fullName || "User");
        }
      } catch (err) {
        setError("Failed to load user interests.");
      }
    };
    fetchUser();
  }, []);

  // Fetch All Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/all");
        if (res.data.success && Array.isArray(res.data.posts)) {
          setPosts(res.data.posts);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError("Failed to load posts. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Filter Posts Based on Interests & Search Query
  const filteredPosts = posts.filter((post) => {
    const captionMatch = query
      ? post.caption?.toLowerCase().includes(query.toLowerCase())
      : true;
    let postTags = [];
    try {
      postTags = JSON.parse(post.tags);
    } catch (error) {
      console.error("Error parsing tags for post:", post.caption, error);
    }
    postTags = Array.isArray(postTags) ? postTags.map((tag) => tag.toLowerCase()) : [];
    const interestTags = userInterests.map((interest) => interest.toLowerCase());
    const tagMatch = postTags.some((tag) => interestTags.includes(tag));
    return captionMatch && tagMatch;
  });

  return (
    <div className={`bg-gradient-to-b ${isDark ? "from-gray-900 to-gray-800 text-white" : "from-gray-50 to-gray-200 text-gray-900"} min-h-screen flex flex-col md:flex-row`}>  
      <LeftSidebar />
      <div className="flex-1 px-4 md:ml-64 w-full max-w-4xl mx-auto pt-32">
        <div className="text-center md:text-left mb-6">
          <h2 className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300">Welcome back, <span className="font-bold text-blue-600 dark:text-blue-400">{fullName}!</span></h2>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg mt-2">
            Explore Your World
          </h1>
        </div>

        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-red-600 font-medium bg-red-200 p-3 rounded-lg shadow-md">{error}</p>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500 flex flex-col items-center">
              <img src="/images/no-data.svg" alt="No posts" className="w-24 md:w-32 h-24 md:h-32 mb-4 opacity-75" />
              <p className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow-sm">No matching posts found. Try exploring new interests!</p>
            </div>
          ) : (
            <div className="flex flex-col w-21 pl-48 space-y-6">
              {filteredPosts.map((post) => (
                <div key={post._id} className={`w-full p-4 rounded-lg shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:scale-105 ${isDark ? "bg-gray-800" : "bg-white"}`}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;