import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]); // Store search results
  const navigate = useNavigate();

  // Handle search input changes
  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm.trim() === "") {
      setUsers([]); // Clear results if empty
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/api/search?query=${searchTerm}`);
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Navigate to user profile using username instead of userId
  const handleUserClick = (userName) => {
    navigate(`/profile/${userName}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Search Users</h1>
      
      {/* Search Input */}
      <div className="relative w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search by username..."
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <Search className="absolute right-3 top-3 text-gray-500" size={20} />
      </div>

      {/* Search Results */}
      {users.length > 0 && (
        <div className="mt-4 bg-white shadow-md rounded-md w-full max-w-lg p-2">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleUserClick(user.userName)} // Updated navigation
            >
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
              <p className="text-lg">{user.userName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
