import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post("http://localhost:3000/api/admin/logout");
    localStorage.removeItem("token");
    navigate("/admin-login");
  };
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <ul className="space-y-3">
        <li>
          <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/users" className="hover:text-gray-300">Manage Users</Link>
        </li>
        <li>
          <Link to="/admin/posts" className="hover:text-gray-300">Manage Posts</Link>
        </li>
        <button onClick={handleLogout} className="mt-6 w-full bg-red-600 py-2 rounded">
        Logout
      </button>
      </ul>
    </div>
  );
};

export default AdminSidebar;
