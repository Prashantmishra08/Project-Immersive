import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import useThemeStore from "../../zustand/useThemeStore";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, reports: 0, posts: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const res = await axios.get("http://localhost:3000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex transition-colors duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                isDark ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-500"
              } text-white shadow-md`}
              onClick={() => navigate("/admin/users")}
            >
              <h2 className="text-xl">Total Users</h2>
              <p className="text-3xl">{stats.users}</p>
            </div>
            <div
              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                isDark ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-500"
              } text-white shadow-md`}
              onClick={() => navigate("/admin/posts")}
            >
              <h2 className="text-xl">Total Posts</h2>
              <p className="text-3xl">{stats.posts}</p>
            </div>
            {/* Uncomment if needed */}
            {/* <div
              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                isDark ? "bg-red-700 hover:bg-red-600" : "bg-red-600 hover:bg-red-500"
              } text-white shadow-md`}
              onClick={() => navigate("/admin/reports")}
            >
              <h2 className="text-xl">Reports</h2>
              <p className="text-3xl">{stats.reports}</p>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
