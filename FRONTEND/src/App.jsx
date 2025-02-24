import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext.jsx";
import LeftSideBar from "./components/LeftSideBar.jsx";
import SearchPage from "./components/SearchPage.jsx";
import Feed from "./components/Feed.jsx";
import MessagePage from "./components/MessagePage.jsx";
import NotificationPage from "./components/NotificationPage.jsx";
import MyCollection from "./components/MyCollection.jsx";
import CreatePost from "./components/CreatePost.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/LogIn.jsx";
import SettingPage from "./components/SettingPage.jsx";
import SearchUserProfile from "./components/SearchUserProfile.jsx";
import AdminPanel from "./components/Admin/AdminPanel.jsx";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageUsers from "./components/Admin/ManageUsers";
import ManagePosts from "./components/Admin/ManagePosts";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminPosts from "./components/Admin/AdminPosts";

const PrivateRoute = ({ element, adminOnly = false }) => {
  const { authUser, loading } = useAuthContext();

  if (loading) return null; // Jab tak auth state load ho rahi h, kuch mat dikhao

  if (!authUser) {
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  if (adminOnly && authUser.role !== "admin") {
    return <Navigate to="/feed" replace />;
  }

  return element;
};


const AuthRoute = ({ element }) => {
  const { authUser, loading } = useAuthContext();

  if (loading) return null; // Wait for auth state to load

  // ✅ If logged in, redirect based on user role
  if (authUser) {
    return authUser.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/feed" replace />;
  }

  // If not logged in, show the requested component (Login or Signup)
  return element;
};


function App() {
  const { authUser } = useAuthContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      {authUser && authUser.role !== "admin" && <LeftSideBar />}
      <div className="flex-1">
        <Routes>
          {/* Normal User Routes */}
          <Route path="/" element={<PrivateRoute element={<Feed />} />} />
          <Route path="/search" element={<PrivateRoute element={<SearchPage />} />} />
          <Route path="/feed" element={<PrivateRoute element={<Feed />} />} />
          <Route path="/message" element={<PrivateRoute element={<MessagePage />} />} />
          <Route path="/notification" element={<PrivateRoute element={<NotificationPage />} />} />
          <Route path="/collection" element={<PrivateRoute element={<MyCollection />} />} />
          <Route path="/create" element={<PrivateRoute element={<CreatePost open={open} setOpen={setOpen} fetchPosts={() => console.log("Fetching posts...")}/>} />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
          <Route path="/setting" element={<PrivateRoute element={<SettingPage />} />} />
          <Route path="/profile/:userName" element={<PrivateRoute element={<SearchUserProfile />} />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AuthRoute element={<AdminLogin />} />} />
          <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} adminOnly />} />
          <Route path="/admin/users" element={<PrivateRoute element={<ManageUsers />} adminOnly />} />
          <Route path="/admin/posts" element={<PrivateRoute element={<ManagePosts />} adminOnly />} />
          <Route path="/admin/users" element={<PrivateRoute element={<AdminUsers />} adminOnly />} />
          <Route path="/admin/posts" element={<PrivateRoute element={<AdminPosts />} adminOnly />} />
          <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} adminOnly />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<AuthRoute element={<Login />} />} />
          <Route path="/signup" element={<AuthRoute element={<SignUp />} />} />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
