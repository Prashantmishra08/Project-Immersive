import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleRoleUpdate = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const handleBanToggle = async (id, isBanned) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/users/${id}/ban`, { banned: !isBanned });
      setUsers(users.map((user) => (user._id === id ? { ...user, banned: !isBanned } : user)));
    } catch (err) {
      console.error("Error banning/unbanning user:", err);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Manage Users</h1>
        {loading ? <p>Loading users...</p> : (
          <table className="w-full border border-gray-700 text-left">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border border-gray-700">
                  <td className="p-2">{user.userName}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.banned ? "Banned" : "Active"}</td>
                  <td className="p-2">
                  <button onClick={() => handleBanToggle(user._id, user.banned)} 
                      className={`px-4 py-1 rounded ${user.banned ? "bg-green-600" : "bg-red-600"} text-white`}>
                      {user.banned ? "Unban" : "Ban"}
                    </button>
                    <select value={user.role} onChange={(e) => handleRoleUpdate(user._id, e.target.value)}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleDelete(user._id)} className="bg-red-600 px-4 py-1 text-white rounded">
                      Delete
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

export default AdminUsers;
