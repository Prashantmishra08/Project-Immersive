
import { useState } from "react";
import { Bell, XCircle } from "lucide-react";

const notificationsData = [
  { id: 1, name: "John Doe", message: "Liked your post", time: "2h ago", avatar: "https://github.com/shadcn.png" },
  { id: 2, name: "Jane Smith", message: "Commented: 'Great post!'", time: "5h ago", avatar: "https://github.com/shadcn.png" },
  { id: 3, name: "Unknown User", message: "Followed you", time: "14h ago", avatar: "https://github.com/shadcn.png" },
];

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(notificationsData);

  const markAllAsRead = () => {
    setNotifications([]);
  };

  return (
    <div className="flex flex-col max-w-xl p-6 bg-gray-100 min-h-screen mx-auto dark:bg-slate-950 dark:text-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <div>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2" onClick={markAllAsRead}>
            Mark All as Read
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={() => setNotifications([])}>
            Clear All
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-3">
                <img src={notification.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{notification.name}</p>
                  <p className="text-gray-600 text-sm">{notification.message}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{notification.time}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;