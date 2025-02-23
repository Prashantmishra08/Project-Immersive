import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SearchUserProfile = () => {
    const { userName } = useParams();
    const [userData, setUserData] = useState(null); // Ensure state exists
    const [showSubscribers, setShowSubscribers] = useState(false);
    const [showSubscribed, setShowSubscribed] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token"); // Ensure token is fetched
                if (!token) {
                    console.error("🚨 No token found in localStorage");
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/searchuserprofile?userName=${userName}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("✅ User Profile Data:", response.data);
                setUserData(response.data.user); // Update state with fetched data
            } catch (error) {
                console.error("❌ Error fetching user data:", error);
            }
        };

        fetchProfile();
    }, [userName]);

    if (!userData) return <p>Loading profile...</p>; // Display loading state

    return (
        <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center">User Profile</h2>
        <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
                    <img src={userData.avatar} alt="Profile" className="w-24 h-24 rounded-full" />
                </div>
                <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                <p className="text-gray-500">{userData.profession || "No profession specified"}</p>
                <p className="text-gray-500">{userData.about}</p>
                <div className="flex space-x-4">
                    <p 
                        className="text-sm text-gray-700 cursor-pointer underline"
                        onClick={() => setShowSubscribers(true)}
                    >
                        Subscribers: {userData.subscribersCount}
                    </p>
                    <p 
                        className="text-sm text-gray-700 cursor-pointer underline"
                        // onClick={() => setShowSubscribed(true)}
                    >
                        Subscribed: {userData.channelsSubscribedToCount}
                    </p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Subscribe
                </button>

                {/* Subscribers Modal */}
            {showSubscribers && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-3">Subscribers</h2>
                        {userData.subscribers.length > 0 ? (
                            <ul>
                                {userData.subscribers.map((subscriber) => (
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
            {/* {showSubscribed && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-3">Subscribed To</h2>
                        {userData.subscribedTo.length > 0 ? (
                            <ul>
                                {userData.subscribedTo.map((channel) => (
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
            )} */}
        </div>
        </div>
    );
};

export default SearchUserProfile;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// // import { FaCamera } from "react-icons/fa";
// import { useParams } from "react-router-dom"
// import PostCard from "./PostCard"; // PostCard component import

// const SearchUserProfile = () => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showSubscribers, setShowSubscribers] = useState(false);
//     const [showSubscribed, setShowSubscribed] = useState(false);
//     const [posts, setPosts] = useState([]); // State to store posts
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
//     const [profilePicture, setProfilePicture] = useState(null);
//     const { userName } = useParams();
//     const [userData, setUserData] = useState(null); // Ensure state exists

//     // useEffect(() => {
//     //     const fetchProfile = async () => {
//     //         try {
//     //             const token = localStorage.getItem("token"); // Ensure token is fetched
//     //             if (!token) {
//     //                 console.error("🚨 No token found in localStorage");
//     //                 return;
//     //             }

//     //             const response = await axios.get(`http://localhost:3000/api/searchuserprofile?userName=${userName}`, {
//     //                 headers: {
//     //                     Authorization: `Bearer ${token}`,
//     //                 },
//     //             });

//     //             console.log("✅ User Profile Data:", response.data);
//     //             setUserData(response.data.user); // Update state with fetched data
//     //         } catch (error) {
//     //             console.error("❌ Error fetching user data:", error);
//     //         }
//     //     };

//     //     fetchProfile();
//     // }, [userName]);

//     // if (!userData) return <p>Loading profile...</p>; // Display loading state

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const token = localStorage.getItem("token"); // Ensure token is fetched
//                 if (!token) {
//                     console.error("🚨 No token found in localStorage");
//                     return;
//                 }

//                 const response = await axios.get(`http://localhost:3000/api/searchuserprofile?userName=${userName}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 console.log("✅ User Profile Data:", response.data);
//                 setUserData(response.data.user); // Update state with fetched data
//             } catch (error) {
//                 console.error("❌ Error fetching user data:", error);
//             }
//         };

//         // const fetchPosts = async () => {
//         //     try {
//         //         const token = localStorage.getItem("token");
//         //         const userId = localStorage.getItem("userId"); // Ensure userId is retrieved
        
//         //         if (!userId) {
//         //             console.error("User ID is missing! Please log in again.");
//         //             return;
//         //         }
        
//         //         const response = await axios.get(`http://localhost:3000/api/user/${userId}`, {
//         //             headers: { Authorization: `Bearer ${token}` },
//         //         });
        
//         //         console.log("Fetched Posts:", response.data);
//         //         setPosts(response.data?.posts || []);
//         //     } catch (error) {
//         //         console.error("Error fetching posts:", error);
//         //     }
//         // };
        
        

//         fetchProfile();
//         // fetchPosts(); // Fetch user posts
//     }, [userName]);
    
    
    

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p className="text-red-500">{error}</p>;

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <h2 className="text-2xl font-bold text-center">{userData.userName}</h2>
//             <div className="flex flex-col items-center text-center space-y-4">
//                 <div className="relative">
//                     <img src={userData.avatar} alt="Profile" className="w-24 h-24 rounded-full" />
//                 </div>
//                 <h1 className="text-2xl font-bold">{userData.fullName}</h1>
//                 <p className="text-gray-500">{userData.profession || "No profession specified"}</p>
//                 <p className="text-gray-500">{userData.about}</p>
//                 {/* <div className="flex space-x-4">
//                     <p 
//                         className="text-sm text-gray-700 cursor-pointer underline"
//                         onClick={() => setShowSubscribers(true)}
//                     >
//                         Subscribers: {userData.subscribersCount}
//                     </p>
//                     <p 
//                         className="text-sm text-gray-700 cursor-pointer underline"
//                         onClick={() => setShowSubscribed(true)}
//                     >
//                         Subscribed: {userData.channelsSubscribedToCount}
//                     </p>
//                 </div>
//                 <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                     Subscribe
//                 </button> */}
//             </div>
    
//             {/* User Posts Section */}
//             {/* <div className="mt-8">
//                 <h3 className="text-xl font-semibold mb-4">Your Posts</h3>
//                 {posts?.length > 0 ? (
//                     posts.map((post) => <PostCard key={post._id} post={post} />)
//                 ) : (
//                     <p className="text-gray-500">No posts available.</p>
//                 )}
//             </div> */}


            
//             {/* Subscribers Modal */}
//             {/* {showSubscribers && (
//                 <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//                     <div className="bg-white p-5 rounded-lg shadow-lg w-80">
//                         <h2 className="text-lg font-bold mb-3">Subscribers</h2>
//                         {user.subscribers.length > 0 ? (
//                             <ul>
//                                 {user.subscribers.map((subscriber) => (
//                                     <li key={subscriber._id} className="border-b py-2 flex items-center">
//                                         <img src={subscriber.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
//                                         {subscriber.userName}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>No subscribers yet.</p>
//                         )}
//                         <button
//                             className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                             onClick={() => setShowSubscribers(false)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )} */}
            
//             {/* Subscribed Modal */}
//             {/* {showSubscribed && (
//                 <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//                     <div className="bg-white p-5 rounded-lg shadow-lg w-80">
//                         <h2 className="text-lg font-bold mb-3">Subscribed To</h2>
//                         {user.subscribedTo.length > 0 ? (
//                             <ul>
//                                 {user.subscribedTo.map((channel) => (
//                                     <li key={channel._id} className="border-b py-2 flex items-center">
//                                         <img src={channel.avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
//                                         {channel.userName}
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p>Not subscribed to anyone.</p>
//                         )}
//                         <button
//                             className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                             onClick={() => setShowSubscribed(false)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )} */}
//         </div>
//     );
// };

// export default SearchUserProfile;
