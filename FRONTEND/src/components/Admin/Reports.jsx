import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token"); // Token ko get karo
        console.log("Sending Token:", token); // Debugging ke liye
    
        const response = await axios.get("http://localhost:3000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`, // Token ko headers me bhejo
          },
        });
    
        console.log("Reports Data:", response.data); // Debugging ke liye
      } catch (error) {
        console.error("Error fetching reports", error.response || error);
      }
    };
    
    
    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setReports(reports.filter((report) => report._id !== reportId));
    } catch (error) {
      console.error("Error deleting report", error);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="p-6 w-full">
        <h2 className="text-3xl font-bold mb-6">Reports</h2>
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr>
              <th className="p-4 text-left text-gray-300">Type</th>
              <th className="p-4 text-left text-gray-300">Reported By</th>
              <th className="p-4 text-left text-gray-300">Reason</th>
              <th className="p-4 text-left text-gray-300">Content</th>
              <th className="p-4 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td className="p-4 text-white">
                  {report.reportedPost ? "Post Report" : "User Report"}
                </td>
                <td className="p-4 text-white">{report.reportedBy?.userName}</td>
                <td className="p-4 text-white">{report.reason}</td>
                <td className="p-4 text-white">
                  {report.reportedPost ? report.reportedPost.content : report.reportedUser?.userName}
                </td>
                <td className="p-4 text-white">
                  <button onClick={() => handleDelete(report._id)} className="bg-red-500 py-2 px-4 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;