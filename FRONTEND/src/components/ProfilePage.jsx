import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import PostCard from "./PostCard"; // PostCard component import

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
    const [profilePicture, setProfilePicture] = useState(null);

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
    
    const handleProfilePictureUpdate = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setProfilePicture(file); // Update state for preview

        const formData = new FormData();
        formData.append("avatar", file);
    
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put("http://localhost:3000/api/updateprofilepicture", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
    
            // Update UI instantly
            setUser((prevUser) => ({
                ...prevUser,
                avatar: response.data.avatar,
            }));
    
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error updating profile picture:", error);
            setError(error.response?.data?.message || "Failed to update profile picture.");
        }
    };
    
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center">{user.userName}</h2>
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                    <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full" />
                    <label htmlFor="profile-pic-upload" className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full cursor-pointer">
                        <FaCamera size={16} />
                        <input type="file" className="hidden" onChange={handleProfilePictureUpdate} />
                    </label>
                    <input 
                        id="profile-pic-upload"
                        type="file" 
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePictureUpdate}
                     />
                </div>
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <p className="text-gray-500">{user.profession || "No profession specified"}</p>
                <p className="text-gray-500">{user.about}</p>
                <div className="flex space-x-4">
                    <p 
                        className="text-sm text-gray-700 cursor-pointer underline"
                        onClick={() => setShowSubscribers(true)}
                    >
                        Subscribers: {user.subscribersCount}
                    </p>
                    <p 
                        className="text-sm text-gray-700 cursor-pointer underline"
                        onClick={() => setShowSubscribed(true)}
                    >
                        Subscribed: {user.channelsSubscribedToCount}
                    </p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={() => setIsEditModalOpen(true)}>
                    Edit Profile
                </button>
            </div>
            {/* User Posts Section */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Your Posts</h3>
                {posts?.length > 0 ? (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                    <p className="text-gray-500">No posts available.</p>
                )}
            </div>

            {/* Update Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-3">Edit Profile</h2>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border mb-2" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border mb-2" required />
                            <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Profession" className="w-full p-2 border mb-2" />
                            <textarea name="about" value={formData.about} onChange={handleChange} placeholder="About" className="w-full p-2 border mb-2"></textarea>
                            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Current Password (Required for password change)" className="w-full p-2 border mb-2" />
                            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New Password" className="w-full p-2 border mb-2" />
                            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Save Changes</button>
                        </form>
                        <button className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
            
            {/* Subscribers Modal */}
            {showSubscribers && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-3">Subscribers</h2>
                        {user.subscribers.length > 0 ? (
                            <ul>
                                {user.subscribers.map((subscriber) => (
                                    <li key={subscriber._id} className="border-b py-2 flex items-center">
                                        <img src={subscriber.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
                                        {subscriber.userName}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No subscribers yet.</p>
                        )}
                        <button
                            className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => setShowSubscribers(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            {/* Subscribed Modal */}
            {showSubscribed && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-3">Subscribed To</h2>
                        {user.subscribedTo.length > 0 ? (
                            <ul>
                                {user.subscribedTo.map((channel) => (
                                    <li key={channel._id} className="border-b py-2 flex items-center">
                                        <img src={channel.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
                                        {channel.userName}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Not subscribed to anyone.</p>
                        )}
                        <button
                            className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => setShowSubscribed(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
