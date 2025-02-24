import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/posts/${id}/block`, { blocked: !isBlocked });
      setPosts(posts.map((post) => (post._id === id ? { ...post, blocked: !isBlocked } : post)));
    } catch (err) {
      console.error("Error blocking/unblocking post:", err);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Manage Posts</h1>
        {loading ? <p>Loading posts...</p> : (
          <table className="w-full border border-gray-700 text-left">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2">Post Content</th>
                <th className="p-2">Author</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border border-gray-700">
                  <td className="p-2">{post.content.slice(0, 50)}...</td>
                  <td className="p-2">{post.author.userName}</td>
                  <td className="p-2">{post.blocked ? "Blocked" : "Active"}</td>
                  <td className="p-2">
                    <button onClick={() => handleDelete(post._id)} className="bg-red-600 px-4 py-1 text-white rounded">
                      Delete
                    </button>
                    <button onClick={() => handleBlockToggle(post._id, post.blocked)} 
                      className={`ml-2 px-4 py-1 rounded ${post.blocked ? "bg-green-600" : "bg-yellow-600"} text-white`}>
                      {post.blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;
