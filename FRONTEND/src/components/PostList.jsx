import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/all") // Backend running on port 3000
      .then((res) => setPosts(res.data.posts)) // Ensure correct data extraction
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
