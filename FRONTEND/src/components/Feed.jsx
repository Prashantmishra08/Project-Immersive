import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard.jsx";
import LeftSidebar from "./LeftSidebar.jsx";
import { useLocation } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

const Feed = () => {
  const query = useQuery().get("search");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, tagsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/all"),
          axios.get("http://localhost:3000/api/most-used-tags"),
        ]);
        
        if (postsRes.data.success && Array.isArray(postsRes.data.posts)) {
          setPosts(postsRes.data.posts);
        } else {
          throw new Error("Invalid data format");
        }
        
        setTags(tagsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load posts. Try again later.");
        setTagsError("Failed to load tags.");
      } finally {
        setLoading(false);
        setTagsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredPosts = query
    ? posts.filter((post) => post.caption?.toLowerCase().includes(query.toLowerCase()))
    : posts;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 px-4 md:ml-64 w-full pt-14">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 ">🔥 Trending Topics</h1>
        
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* Posts Section */}
          <div className="md:w-3/4 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            {loading ? (
              <p className="text-center text-gray-600 dark:text-gray-300 animate-pulse">Loading posts...</p>
            ) : error ? (
              <p className="text-center text-red-600 dark:text-red-400">{error}</p>
            ) : filteredPosts.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">No matching posts found</p>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Tags Sidebar */}
          <div className="md:w-1/4 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-fit sticky top-20">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-4">🔥 Popular Tags</h2>
            {tagsLoading ? (
              <p className="text-center text-gray-600 dark:text-gray-300 animate-pulse">Loading tags...</p>
            ) : tagsError ? (
              <p className="text-center text-red-500 dark:text-red-400">{tagsError}</p>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center">
                {tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-200 cursor-pointer"
                  >
                    #{tag._id} ({tag.count})
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
