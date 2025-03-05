import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useThemeStore from "../zustand/useThemeStore.js";

const InterestSelection = () => {
  const [tags, setTags] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsResponse = await axios.get("http://localhost:3000/api/tags");
        setTags(tagsResponse.data);

        const interestsResponse = await axios.get("http://localhost:3000/api/interests", { withCredentials: true });
        const normalizedInterests = interestsResponse.data.interests.map(interest => interest.toLowerCase());
        setSelectedInterests(normalizedInterests);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setSelectedInterests((prev) =>
      checked ? [...prev, value.toLowerCase()] : prev.filter((interest) => interest !== value.toLowerCase())
    );
  };

  const saveInterests = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/user/interests",
        { interests: selectedInterests },
        { withCredentials: true }
      );
      toast.success("Interests updated successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      toast.error("Failed to update interests.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading interests...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-8 transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <div className={`shadow-2xl p-10 rounded-3xl w-full max-w-4xl flex flex-col gap-8 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} backdrop-blur-lg`}>
                <h2 className="text-center font-extrabold text-3xl tracking-wide bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                    Select Your Interests
                </h2>

                {/* Grid Layout with Vertical Scroll */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-h-80 overflow-y-auto p-4 rounded-xl scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
                    {tags.map((tag) => (
                        <label 
                            key={tag} 
                            className={`flex items-center space-x-3 cursor-pointer px-6 py-3 rounded-2xl shadow-md transition-all duration-300 text-lg font-semibold tracking-wide 
                            ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}`}>
                            <input
                                type="checkbox"
                                value={tag}
                                checked={selectedInterests.includes(tag.toLowerCase())}
                                onChange={handleInterestChange}
                                className="h-5 w-5 text-blue-600 accent-blue-500"
                            />
                            <span>{tag}</span>
                        </label>
                    ))}
                </div>

                <Button onClick={saveInterests} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 p-4 rounded-2xl text-white font-bold shadow-xl transition-transform transform active:scale-95">
                    Save Interests
                </Button>
            </div>
        </div>
  );
};

export default InterestSelection;
