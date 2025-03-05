import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import useThemeStore from "../zustand/useThemeStore.js";

const CreatePost = ({ open, setOpen, fetchPosts = () => {} }) => {
  const {isDark } = useThemeStore();
  const fileInputRef = useRef();
  const tagContainerRef = useRef(null); // ✅ Ref for scroll
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.url) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/tags");
        setSuggestedTags(res.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileType = file.type.split("/")[0];

      if (fileType === "image") {
        setPreview({ type: "image", url: URL.createObjectURL(file) });
      } else if (fileType === "video") {
        setPreview({ type: "video", url: URL.createObjectURL(file) });
      }
    }
  };

  const handleTagSearch = (e) => {
    setTagInput(e.target.value);
  };

  const selectTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTimeout(() => {
        if (tagContainerRef.current) {
          tagContainerRef.current.scrollTop = tagContainerRef.current.scrollHeight;
        }
      }, 100);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const createPostHandler = async (e) => {
  e.preventDefault();

  if (!selectedFile) {
    alert("Please select a file!");
    return;
  }
  if (!caption.trim()) {
    alert("Caption is required!");
    return;
  }

  setLoading(true);

  const fileType = selectedFile.type.startsWith("video") ? "video" : "image";

  const profilePic = localStorage.getItem("profilePic");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("caption", caption);
  formData.append("fileType", fileType);
  formData.append("username", username);
  formData.append("profilePic", profilePic && profilePic !== "null" ? profilePic : ""); // ✅ Handle null case
  formData.append("userId", userId);
  formData.append("tags", JSON.stringify(tags)); // ✅ Ensure JSON format

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated!");
      setLoading(false);
      return;
    }

    const uploadRes = await axios.post("http://localhost:3000/api/upload-and-create", formData, {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
    });

    console.log("✅ Upload & Post Success:", uploadRes.data);
    // **Reset form data after successful post**
    setCaption("");          // ✅ Caption clear
    setSelectedFile(null);   // ✅ File reset
    setPreview(null);        // ✅ Preview reset
    setTags([]);             // ✅ Tags reset
    setTagInput("");         // ✅ Tag input reset
    fileInputRef.current.value = ""; // ✅ File input clear

    fetchPosts();
    setOpen(false);
    setTags([]);
  } catch (error) {
    console.error("🚨 Error Creating Post:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Upload failed!");
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className={`max-h-[80vh] overflow-y-auto ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
    <DialogHeader>
      <DialogTitle className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        Create New Post
      </DialogTitle>
    </DialogHeader>

    <Textarea
      value={caption}
      onChange={(e) => setCaption(e.target.value)}
      placeholder="Write a caption..."
      className={`border rounded-md p-2 w-full ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
    />

    {/* ✅ Tags Search Field */}
    <div className="mt-2 relative">
      <input
        type="text"
        className={`w-full border p-2 rounded-md focus:outline-none ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        placeholder="Search tags..."
        value={tagInput}
        onChange={handleTagSearch}
      />
      {tagInput && (
        <div className={`absolute border rounded-md w-full mt-1 shadow-lg z-10 max-h-32 overflow-y-auto ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}>
          {suggestedTags
            .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
            .slice(0, 5)
            .map((tag, index) => (
              <div
                key={index}
                onClick={() => selectTag(tag)}
                className={`p-2 cursor-pointer ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              >
                {tag}
              </div>
            ))}
        </div>
      )}
    </div>

    {/* ✅ Selected Tags */}
    <div ref={tagContainerRef} className={`flex flex-wrap gap-2 mt-2 max-h-20 overflow-y-auto ${isDark ? "text-gray-200" : "text-gray-900"}`}>
      {tags.map((tag, index) => (
        <span key={index} className={`px-3 py-1 rounded-full flex items-center gap-2 ${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
          {tag}
          <button onClick={() => removeTag(tag)} className="text-red-500 font-bold">×</button>
        </span>
      ))}
    </div>

    {/* File Preview */}
    {preview && (
      <div className="w-full mt-2 rounded-md overflow-hidden">
        {preview.type === "video" ? (
          <video src={preview.url} controls className={`w-full rounded-md shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`} />
        ) : (
          <img src={preview.url} alt="Preview" className={`w-full rounded-md shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`} />
        )}
      </div>
    )}

    <input ref={fileInputRef} type="file" accept="image/*,video/*" hidden onChange={fileChangeHandler} />

    <div className="flex gap-2 mt-4">
      <Button
        onClick={() => fileInputRef.current.click()}
        className={`${isDark ? "bg-red-700 hover:bg-red-800" : "bg-red-600 hover:bg-red-700"} text-white px-4 py-2 rounded-xl w-full`}
      >
        Select File
      </Button>

      <Button
        onClick={createPostHandler}
        disabled={loading}
        className={`px-4 py-2 rounded-xl w-full ${loading ? "bg-gray-500" : isDark ? "bg-blue-800 hover:bg-blue-900" : "bg-blue-700 hover:bg-blue-800 text-white"}`}
      >
        {loading ? <Loader2 className="animate-spin" /> : "Post"}
      </Button>
    </div>
  </DialogContent>
</Dialog>

  );
};

export default CreatePost;
