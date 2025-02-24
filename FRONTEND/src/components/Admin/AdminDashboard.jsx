import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, bannedUsers: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <h2 className="text-xl">Total Users</h2>
              <p className="text-3xl">{stats.users}</p>
            </div>
            <div className="bg-red-600 text-white p-6 rounded-lg">
              <h2 className="text-xl">Banned Users</h2>
              <p className="text-3xl">{stats.bannedUsers}</p>
            </div>
            <div className="bg-green-600 text-white p-6 rounded-lg">
              <h2 className="text-xl">Total Posts</h2>
              <p className="text-3xl">{stats.posts}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
