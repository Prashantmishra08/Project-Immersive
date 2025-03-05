import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    userName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/admin/profile");
        setAdminData(data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="flex">
    <AdminSidebar />
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Profile</h2>
      <div className="space-y-4">
        <p><strong>Username: </strong>{adminData.userName}</p>
        <p><strong>Email: </strong>{adminData.email}</p>
        <p><strong>Role: </strong>{adminData.role}</p>
      </div>
    </div>
    </div>
  );
};

export default AdminProfile;
