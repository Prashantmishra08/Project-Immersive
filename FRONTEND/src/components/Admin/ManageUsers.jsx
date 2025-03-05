import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import useThemeStore from "../../zustand/useThemeStore";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const { isDark } = useThemeStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/admin/user/details/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserDetails(res.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleExpandUser = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      setUserDetails({});
    } else {
      setExpandedUser(userId);
      fetchUserDetails(userId);
    }
  };

  return (
    <div className={`flex transition-colors duration-300 ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Manage Users</h1>

        {loading ? (
          <p className="text-lg">Loading users...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full border ${isDark ? "border-gray-600 text-white" : "border-gray-700 text-gray-900"} text-left`}>
              <thead>
                <tr className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}>
                  <th className="p-3">Profile Pic</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Actions</th>
                  <th className="p-3">More Details</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr className={`border ${isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"} transition-all`}>
                      <td className="p-3">
                        <img
                          src={user.avatar || "default-avatar.png"}
                          alt="Profile Pic"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </td>
                      <td className="p-3">{user.userName}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 px-4 py-1 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleExpandUser(user._id)}
                          className="bg-blue-600 px-4 py-1 text-white rounded hover:bg-blue-700"
                        >
                          {expandedUser === user._id ? "Hide Details" : "More Details"}
                        </button>
                      </td>
                    </tr>

                    {expandedUser === user._id && (
                      <tr className={`${isDark ? "bg-gray-800" : "bg-gray-200"} transition-all`}>
                        <td colSpan="5" className="p-3">
                          <div>
                            <strong>Full Name:</strong> {userDetails.userDetails?.fullName || "N/A"}<br />
                            <strong>Profession:</strong> {userDetails.userDetails?.profession || "N/A"}<br />
                            <strong>About:</strong> {userDetails.userDetails?.about || "N/A"}<br />
                            <br />
                            <strong>Total Posts:</strong> {userDetails.totalPosts || "N/A"}<br />
                            {/* <strong>Followers:</strong> {userDetails.followersCount || "N/A"}<br />
                            <strong>Following:</strong> {userDetails.followingCount || "N/A"}<br /> */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
