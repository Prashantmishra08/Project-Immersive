import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, Star, Film, MessageSquare, Bell, PlusCircle, User, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import { IoIosSunny, IoMdMoon } from "react-icons/io";
import codeConnect from "../assets/codeConnect.png";
import useThemeStore from '../zustand/useThemeStore';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
const LeftSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeItem, setActiveItem] = useState('Home');
    const { isDark, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false); // ✅ Fixed undefined error
    const searchBoxRef = useRef(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleItemClick = (label, path) => {
        setActiveItem(label);
        if (label === 'Create') setOpen(true);
        else navigate(path);
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const token = localStorage.getItem("token");
                const loggedInUserId = localStorage.getItem("userId");

                if (!token || !loggedInUserId) return;

                const response = await axios.get(`http://localhost:3000/api/searchuserprofile?userName=${searchTerm}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && Array.isArray(response.data.users)) {
                    const filteredUsers = response.data.users
                        .filter(user => user._id !== loggedInUserId) // ✅ Fixed filtering
                        .filter(user =>
                            user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                        );

                    setSearchResults(filteredUsers);
                    setShowResults(filteredUsers.length > 0);
                }
            } catch (error) {
                console.error("❌ Error fetching search results:", error);
            }
        };

        fetchSearchResults();
    }, [searchTerm]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
                setSearchTerm("");
                setSearchResults([]);
                setShowResults(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-6 py-3 z-50">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleSidebar}>
                    <Menu size={28} className="text-gray-800 dark:text-white" />
                    <img src={codeConnect} alt="Logo" className="w-20 h-20" />
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">codeConnect</span>
                </div>
                <div className="relative w-1/2" ref={searchBoxRef}>
                    <input 
                        type="text" 
                        placeholder="Search User..." 
                        className="w-full px-4 py-2 border rounded-full dark:bg-gray-700 dark:text-white pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={20} className="absolute left-3 top-3 text-gray-500" />
                    
                    {showResults && searchResults.length > 0 && (
                        <div className="absolute w-full bg-white dark:bg-gray-700 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {searchResults.map((user) => (
                                <div 
                                    key={user._id} 
                                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                                    onClick={() => {
                                        setSearchTerm(""); 
                                        setSearchResults([]); 
                                        setShowResults(false); 
                                        navigate(`/profile/${user.userName}`); 
                                    }}
                                >
                                    <img src={user.avatar} alt={user.userName} className="w-8 h-8 rounded-full mr-3" />
                                    <div>
                                        <p className="text-sm font-semibold">{user.fullName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.userName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-6">
                    <button onClick={toggleTheme}>
                        {isDark ? <IoIosSunny size={28} className="text-yellow-500" /> : <IoMdMoon size={28} className="text-gray-800 dark:text-white" />}
                    </button>
                    <UserCircle
                            size={40} 
                            className="text-gray-500 dark:text-gray-300 cursor-pointer" 
                            onClick={() => navigate('/profile')} 
                        />
                </div>
            </nav>
            
            {/* Sidebar */}
            <div className={`mt-28 ${isSidebarOpen ? 'w-64' : 'w-16'} h-full fixed left-0 top-0 flex flex-col p-4 bg-white dark:bg-gray-800 shadow-md transition-all duration-300`}> 
                {isSidebarOpen && (
                    <div className="flex flex-col space-y-6 text-gray-800 dark:text-white">
                        {[
                            { icon: <Home size={24} />, label: "Home", path: "/" },
                            { icon: <MessageSquare size={24} />, label: "Messages", path: "/message" },
                            { icon: <Film size={24} />, label: "Feed", path: "/feed" },
                            { icon: <Bell size={24} />, label: "Notifications", path: "/notifications" },
                            { icon: <PlusCircle size={24} />, label: "Create", path: "/create" },
                            { icon: <User size={24} />, label: "Profile", path: "/profile" },
                            { icon: <Settings size={24} />, label: "Setting", path: "/setting" }
                        ].map(({ icon, label, path }) => (
                            <SidebarItem key={label} icon={icon} label={label} isActive={activeItem === label} onClick={() => handleItemClick(label, path)} />
                        ))}
                        <CreatePost open={open} setOpen={setOpen} />
                    </div>
                )}
            </div>
        </>
    );
};

const SidebarItem = ({ icon, label, isActive, onClick }) => (
    <Button variant="ghost" className={`flex items-center space-x-3 justify-start w-full text-lg font-medium ${isActive ? 'bg-gray-200 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`} onClick={onClick}>
        {React.cloneElement(icon, { size: 24 })}
        {label}
    </Button>
);

export default LeftSidebar;
