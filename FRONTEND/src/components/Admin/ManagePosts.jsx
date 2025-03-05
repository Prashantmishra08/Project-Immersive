import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import useThemeStore from "../../zustand/useThemeStore";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useThemeStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found!");

      const res = await axios.get("http://localhost:3000/api/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found!");

      await axios.delete(`http://localhost:3000/api/admin/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Manage Posts</h1>

        {loading ? (
          <p className="text-lg">Loading posts...</p>
        ) : (
          <div className={`overflow-x-auto shadow-lg rounded-lg p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <table className="w-full border-collapse">
              <thead>
                <tr className={`${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
                  <th className="p-3 border">Author</th>
                  <th className="p-3 border">Profile Pic</th>
                  <th className="p-3 border">Post</th>
                  <th className="p-3 border">Caption</th>
                  <th className="p-3 border">Created At</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className={`border-b hover:${isDark ? "bg-gray-700" : "bg-gray-100"} transition-all`}>
                    <td className="p-3">{post.username || "Unknown"}</td>
                    <td className="p-3">
                      <img
                        src={post.userId?.avatar}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border"
                      />
                    </td>
                    <td className="p-3">
                      {post.fileUrl ? (
                        post.fileUrl.endsWith(".mp4") || post.fileUrl.endsWith(".webm") ? (
                          <video controls className="w-32 h-32 rounded-lg shadow-md">
                            <source src={post.fileUrl} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={post.fileUrl}
                            alt="Post"
                            className="w-32 h-32 rounded-lg shadow-md object-cover"
                          />
                        )
                      ) : (
                        <p className="text-gray-500">No media</p>
                      )}
                    </td>
                    <td className="p-3">{post.caption || "No caption"}</td>
                    <td className="p-3">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePosts;
