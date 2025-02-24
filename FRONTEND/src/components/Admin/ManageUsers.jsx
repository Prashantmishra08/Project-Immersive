import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/users/${id}`);
    setUsers(users.filter(user => user._id !== id));
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        {users.map(user => (
          <div key={user._id} className="flex justify-between p-4 bg-gray-200 mt-2">
            <span>{user.userName} ({user.email})</span>
            <button onClick={() => handleDelete(user._id)} className="bg-red-600 text-white px-2 py-1 rounded">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
