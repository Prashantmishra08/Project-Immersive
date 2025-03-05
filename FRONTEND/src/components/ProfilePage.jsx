import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import PostCard from "./PostCard"; // PostCard component import
import { useNavigate } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.jsx";
import useThemeStore from "../zustand/useThemeStore.js";


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSubscribers, setShowSubscribers] = useState(false);
    const [showSubscribed, setShowSubscribed] = useState(false);
    const [posts, setPosts] = useState([]); // State to store posts
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        profession: "",
        about: "",
        currentPassword: "",
        newPassword: ""
    });
    const { isDark } = useThemeStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No authentication token found. Please log in.");
                    return;
                }
                
                const response = await axios.get("http://localhost:3000/api/userprofile", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                setUser(response.data.channel);
                setFormData({
                    fullName: response.data.channel.fullName,
                    email: response.data.channel.email,
                    profession: response.data.channel.profession || "",
                    about: response.data.channel.about || "",
                    currentPassword: "",
                    newPassword: ""
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error.response?.data?.message || "Failed to fetch profile.");
                setLoading(false);
            }
        };

        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId"); // Ensure userId is retrieved
        
                if (!userId) {
                    console.error("User ID is missing! Please log in again.");
                    return;
                }
        
                const response = await axios.get(`http://localhost:3000/api/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
        
                console.log("Fetched Posts:", response.data);
                setPosts(response.data?.posts || []);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        
        

        fetchProfile();
        fetchPosts(); // Fetch user posts
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found. Please log in.");
                return;
            }
    
            const response = await axios.put("http://localhost:3000/api/updateprofile", formData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
    
            alert("Profile updated successfully");
    
            // Update state immediately to reflect changes
            setUser((prevUser) => ({
                ...prevUser,
                fullName: formData.fullName,
                email: formData.email,
                profession: formData.profession,
                about: formData.about,
                avatar: response.data.avatar || prevUser.avatar, // Update avatar if changed
            }));
    
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setError(error.response?.data?.message || "Failed to update profile.");
        }
    };
    
    
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className={`max-w-4xl mx-auto p-6 pt-36 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
    <LeftSidebar />
    
    {/* Profile Header */}
    <div className="flex flex-col items-center text-center space-y-4 bg-opacity-60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-300 dark:border-gray-700">
        {/* Profile Image */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl hover:scale-105 transition transform duration-300">
            <img src={user.avatar} alt="Profile" className="w-full h-full" />
        </div>
        
        {/* User Info */}
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">{user.fullName}</h1>
        <p className="text-gray-400 text-lg">{user.profession || "No profession specified"}</p>
        <p className="text-gray-500 max-w-md leading-relaxed">{user.about}</p>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
            <button
                className="px-6 py-3 rounded-lg font-medium transition-all shadow-md bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 hover:shadow-xl"
                onClick={() => setIsEditModalOpen(true)}
            >
                Edit Profile
            </button>
            <button
                className="px-6 py-3 rounded-lg font-medium transition-all shadow-md bg-gradient-to-r from-green-400 to-teal-500 text-white hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/interests")}
            >
                Interests
            </button>
        </div>
    </div>

    {/* User Posts Section */}
    <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 text-center">Your Posts</h3>
        {posts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => <PostCard key={post._id} post={post} isDark={isDark} />)}
            </div>
        ) : (
            <p className="text-gray-500 text-center">No posts available.</p>
        )}
    </div>

    {/* Update Profile Modal */}
    {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg">
            <div className="p-6 rounded-xl pt-36 shadow-xl w-96 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-3 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500" required />
                    <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Profession" className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500" />
                    <textarea name="about" value={formData.about} onChange={handleChange} placeholder="About" className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"></textarea>
                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Current Password" className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500" />
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" className="w-full p-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500" />
                    <button type="submit" className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow-md">Save Changes</button>
                </form>
                <button className="mt-4 w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
        </div>
    )}
</div>

    );
};

export default ProfilePage;
