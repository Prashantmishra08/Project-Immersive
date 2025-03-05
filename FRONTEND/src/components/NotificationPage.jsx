import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import useThemeStore from "../zustand/useThemeStore"; // ✅ Dark Mode Store
import LeftSidebar from "./LeftSidebar"; // ✅ Added LeftSidebar

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useThemeStore(); // ✅ Theme state

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:3000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(res.data.notifications || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load updates");
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = moment(notification.createdAt).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
    let label = date;
    if (date === today) label = "Today";
    else if (date === yesterday) label = "Yesterday";

    if (!acc[label]) acc[label] = [];
    acc[label].push(notification);
    return acc;
  }, {});

  return (
    <div className="flex pt-28">
      {/* ✅ Left Sidebar */}
      <LeftSidebar />

      {/* ✅ Main Content */}
      <div
        className={`p-6 max-w-2xl mx-auto shadow-2xl rounded-lg border flex-1
        ${isDark ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
      >
        {/* 🔥 Dynamic Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-5 px-6 rounded-t-lg shadow-md">
          <h2 className="text-3xl font-extrabold text-center tracking-wide">📬 Activity Feed</h2>
        </div>

        {Object.keys(groupedNotifications).length > 0 ? (
          <div className="space-y-6 p-4">
            {Object.entries(groupedNotifications).map(([dateLabel, notifs]) => (
              <div key={dateLabel}>
                <h3
                  className={`text-lg font-semibold mb-2 border-l-4 pl-2 
                  ${isDark ? "text-gray-300 border-indigo-400" : "text-gray-700 border-indigo-500"}`}
                >
                  {dateLabel}
                </h3>
                <ul className="space-y-4">
                  {notifs.map((notification) => (
                    <div
                      key={notification._id}
                      className={`flex items-center p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform 
                      hover:scale-[1.02] 
                      ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-black"
                      }`}
                    >
                      {/* Sender Profile */}
                      <img
                        src={notification.senderId?.avatar || "/default-avatar.png"}
                        alt="Profile"
                        className="w-14 h-14 rounded-full border-2 shadow-md transition hover:scale-110"
                      />

                      <div className="ml-4 flex-1">
                        <p className={`font-semibold text-lg ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                          {notification.senderId?.userName}
                        </p>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs mt-1 text-gray-400">
                          {moment(notification.createdAt).format("hh:mm A")}
                        </p>
                      </div>

                      {/* Post Image */}
                      {notification.postId?.postImage && (
                        <img
                          src={notification.postId?.postImage}
                          alt="Post"
                          className="w-14 h-14 ml-auto rounded-md shadow-md hover:scale-110 transition"
                        />
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No recent updates available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
