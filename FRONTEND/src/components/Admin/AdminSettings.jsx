import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminSettings = () => {
  return (
    <div className="flex">
    <AdminSidebar />
        <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      <p>Settings content will go here.</p>
    </div>
    </div>
  );
};

export default AdminSettings;
