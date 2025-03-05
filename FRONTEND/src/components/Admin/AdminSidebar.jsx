import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useThemeStore from "../../zustand/useThemeStore.js";
import { Sun, Moon } from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3000/api/admin/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("token");
      window.location.href = "/admin/login";
      
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed!");
    }
  };

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
      return Promise.reject(error);
    }
  );

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Manage Users", path: "/admin/users" },
    { name: "Manage Posts", path: "/admin/posts" },
  ];

  return (
    <div
      className={`w-64 h-screen p-4 sticky top-0 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>

      {/* 🌗 Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all duration-300 bg-gray-700 text-white hover:bg-gray-600"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block py-2 px-4 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-blue-500 text-white"
                  : isDark
                  ? "hover:bg-gray-700 hover:text-gray-300"
                  : "hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-red-600 py-2 rounded-lg text-white font-semibold hover:bg-red-700 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
