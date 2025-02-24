import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/posts/${id}`);
    setPosts(posts.filter(post => post._id !== id));
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        {posts.map(post => (
          <div key={post._id} className="flex justify-between p-4 bg-gray-200 mt-2">
            <span>{post.content}</span>
            <button onClick={() => handleDelete(post._id)} className="bg-red-600 text-white px-2 py-1 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePosts;
