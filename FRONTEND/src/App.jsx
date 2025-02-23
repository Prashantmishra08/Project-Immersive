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
import AdminPanel from "./components/AdminPanel.jsx";
import SearchUserProfile from "./components/SearchUserProfile.jsx";

const PrivateRoute = ({ element }) => {
  const { authUser, loading } = useAuthContext();
  if (loading) return null;
  return authUser ? element : <Navigate to="/login" replace />;
};

const AuthRoute = ({ element }) => {
  const { authUser, loading } = useAuthContext();
  if (loading) return null;
  return authUser ? <Navigate to="/feed" replace /> : element;
};

function App() {
  const { authUser } = useAuthContext();
  const [open, setOpen] = useState(false); // ✅ Define setOpen

  return (
    <div className="flex">
      {authUser && <LeftSideBar />}
      <div className="flex-1">
        <Routes>
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
          <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} />} />

          <Route path="/login" element={<AuthRoute element={<Login />} />} />
          <Route path="/signup" element={<AuthRoute element={<SignUp />} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
