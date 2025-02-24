// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "../../context/AuthContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // For redirecting after logout

// const AdminPanel = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedUser, setExpandedUser] = useState(null);
//   const { setAuthUser } = useAuthContext();
//   const navigate = useNavigate(); // Initialize navigation

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/users");
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3000/api/users/${id}`);
//       setUsers(users.filter((user) => user._id !== id));
//     } catch (err) {
//       console.error("Error deleting user:", err);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await axios.post(
//           "http://localhost:3000/api/admin/logout",
//           {},
//           { withCredentials: true }
//       );

//       console.log("Logout successful:", response.data);

//       // 🔴 Remove token from local storage
//       localStorage.removeItem("token");

//       // Clear auth state
//       setAuthUser(null);

//       // Redirect to login
//       navigate("/login");
      
//   } catch (error) {
//       console.error("Logout failed:", error.response?.data?.message || error.message);
//       alert("Logout failed! Please try again.");
//   }
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center bg-gray-900 text-white p-12 relative">
//       {/* Logout Button (Top-Left) */}
//       <button
//         onClick={handleLogout}
//         className="absolute top-5 left-5 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//       >
//         Logout
//       </button>

//       <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      
//       {loading ? (
//         <p className="text-lg">Loading users...</p>
//       ) : (
//         <div className="w-full max-w-4xl space-y-4">
//           {users.map((user) => (
//             <div
//               key={user._id}
//               className="bg-gray-800 shadow-lg rounded-xl p-6 w-full flex flex-col items-center transition-transform duration-300"
//             >
//               <div className="flex items-center space-x-4 w-full">
//                 <img
//                   src={user.avatar}
//                   alt="Profile"
//                   className="w-14 h-14 rounded-full border-2 border-gray-600 object-cover"
//                 />
//                 <h2
//                   className="text-xl font-semibold cursor-pointer hover:text-blue-400 transition w-full text-center"
//                   onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
//                 >
//                   {user.userName}
//                 </h2>
//                 <button
//                   onClick={() => handleDelete(user._id)}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 ml-auto"
//                 >
//                   Delete
//                 </button>
//               </div>

//               {expandedUser === user._id && (
//                 <div className="mt-4 w-full bg-gray-700 p-4 rounded-lg shadow-inner">
//                   <p className="text-gray-300"><strong>Full Name:</strong> {user.fullName}</p>
//                   <p className="text-gray-400"><strong>Email:</strong> {user.email}</p>
//                   <p className="text-gray-400"><strong>Profession:</strong> {user.profession}</p>
//                   <p className="text-gray-400"><strong>About:</strong> {user.about}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPanel;
import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/reports", { withCredentials: true });
      setReports(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const deleteReport = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/reports/${id}`, { withCredentials: true });
      setReports(reports.filter(report => report._id !== id));
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Reported Content</h2>
      {reports.map((report) => (
        <div key={report._id} className="report">
          <p><strong>Reported By:</strong> {report.reportedBy.userName}</p>
          <p><strong>Reason:</strong> {report.reason}</p>
          <button onClick={() => deleteReport(report._id)}>Delete Report</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
