import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext"; 
import LeftSidebar from "./LeftSidebar.jsx";
import useThemeStore from "../zustand/useThemeStore.js";
import { FiLogOut, FiTrash2 } from "react-icons/fi"; // Importing Icons

const SettingPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(""); 
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();
    const { isDark } = useThemeStore();

    // Function to handle logout
    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true });
            localStorage.removeItem("token");
            setAuthUser(null);
            navigate("/login");
        } catch (error) {
            alert("Logout failed! Please try again.");
        }
    };

    // Function to handle account deletion
    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete("http://localhost:3000/api/delete-account", { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });

            localStorage.removeItem("token");
            setAuthUser(null);
            navigate("/login");
        } catch (error) {
            alert("Failed to delete account. Please try again.");
        }
    };

    // Function to handle modal actions
    const handleConfirmAction = () => {
        if (actionType === "logout") {
            handleLogout();
        } else if (actionType === "delete") {
            handleDeleteAccount();
        }
        setShowModal(false);
    };

    return (
        <div className={`flex h-screen pt-28 pl-60 ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <LeftSidebar />
            
            {/* Main Content */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    
                    {/* Logout Card */}
                    <div 
                        className={`max-w-sm rounded-2xl shadow-lg p-6 text-center transform transition duration-300 hover:scale-105 
                            ${isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}
                            backdrop-blur-md bg-opacity-100`} 
                    >
                        <FiLogOut className="text-blue-500 text-5xl mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-4">Logout</h2>
                        <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mb-4`}>
                            Want to logout? Click below.
                        </p>
                        <button 
                            onClick={() => { setActionType("logout"); setShowModal(true); }}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Delete Account Card */}
                    <div 
                        className={`max-w-sm rounded-2xl shadow-lg p-6 text-center transform transition duration-300 hover:scale-105 
                            ${isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}
                            backdrop-blur-md bg-opacity-100`} 
                    >
                        <FiTrash2 className="text-red-500 text-5xl mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
                        <p className={`${isDark ? "text-gray-300" : "text-gray-700"} mb-4`}>
                            This action is permanent. Proceed with caution.
                        </p>
                        <button 
                            onClick={() => { setActionType("delete"); setShowModal(true); }}
                            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 transform hover:scale-105"
                        >
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className={`p-6 rounded-lg shadow-lg w-96 text-center ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                        <h2 className="text-xl font-semibold mb-4">
                            {actionType === "logout" ? "Confirm Logout" : "Confirm Deletion"}
                        </h2>
                        <p className="mb-4">
                            {actionType === "logout"
                                ? "Are you sure you want to logout?"
                                : "Are you sure you want to delete your account? This action is irreversible."}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={handleConfirmAction}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                            >
                                Confirm
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingPage;
