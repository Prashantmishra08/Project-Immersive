// import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
// import { Textarea } from "./ui/textarea";
// import { Button } from "./ui/button";
// import { Loader2 } from "lucide-react";

// const CreatePost = ({ open, setOpen, fetchPosts = () => {} }) => {
//   const fileInputRef = useRef();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [caption, setCaption] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     return () => {
//       if (preview) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   const fileChangeHandler = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const createPostHandler = async (e) => {
//     e.preventDefault();

//     if (!selectedFile) {
//       alert("Please select a file!");
//       return;
//     }
//     if (!caption.trim()) {
//       alert("Caption is required!");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("caption", caption);
//     formData.append("userId", localStorage.getItem("userId"));
//     formData.append("username", "YourUsername"); // Dynamic later
//     formData.append("profilePic", "YourProfilePicURL"); // Dynamic later

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("User is not authenticated!");
//         setLoading(false);
//         return;
//       }

//       const uploadRes = await axios.post("http://localhost:3000/api/upload-and-create", formData, {
//         headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
//       });

//       console.log("Upload & Post Success:", uploadRes.data);

//       fetchPosts(); // Refresh posts
//       setOpen(false);
//     } catch (error) {
//       console.error("Error:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "Upload failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create New Post</DialogTitle>
//         </DialogHeader>

//         <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." />

//         {preview && <img src={preview} alt="Preview" className="w-full rounded-md" />}

//         <input ref={fileInputRef} type="file" accept="image/*, video/*" hidden onChange={fileChangeHandler} />

//         <div className="flex gap-2">
//           <Button onClick={() => fileInputRef.current.click()} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl">
//             Select File
//           </Button>

//           <Button onClick={createPostHandler} disabled={loading} className="bg-blue-700 text-white rounded-xl px-4 py-2">
//             {loading ? <Loader2 className="animate-spin" /> : "Post"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreatePost;


import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const CreatePost = ({ open, setOpen, fetchPosts = () => {} }) => {
    const imageInputRef = useRef();
    const videoInputRef = useRef();
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [preview, setPreview] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const fileChangeHandler = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "image") {
        setSelectedImage(file);
        setSelectedVideo(null);
      } else {
        setSelectedVideo(file);
        setSelectedImage(null);
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();

    if (!selectedImage && !selectedVideo) {
        alert("Please select an image or video!");
        return;
    }

    if (!caption.trim()) {
        alert("Caption is required!");
        return;
    }

    setLoading(true);
    const formData = new FormData();
    const file = selectedImage || selectedVideo;
    
    if (!file) {
        alert("File is missing!");
        return;
    }

    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("userId", localStorage.getItem("userId"));

    // Debug: Log FormData before sending
    console.log("FormData Entries:");
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User is not authenticated!");
            setLoading(false);
            return;
        }

        const apiEndpoint = selectedImage ? "/api/upload/image" : "/api/upload/video";

        const uploadRes = await axios.post(`http://localhost:3000${apiEndpoint}`, formData, {
            headers: { 
                // REMOVE "Content-Type" (Axios will set it automatically)
                Authorization: `Bearer ${token}`
            },
        });

        console.log("Upload Success:", uploadRes.data);
        fetchPosts();
        setOpen(false);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Upload failed!");
    } finally {
        setLoading(false);
    }
};



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." />

        {preview && (selectedImage ? <img src={preview} alt="Preview" className="w-full rounded-md" /> : <video src={preview} controls className="w-full rounded-md" />)}

        <div className="flex gap-2">
          <Button onClick={() => imageInputRef.current.click()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl">
            Select Image
          </Button>
          <Button onClick={() => videoInputRef.current.click()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl">
            Select Video
          </Button>
        </div>
        <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={(e) => fileChangeHandler(e, "image")} />
        <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={(e) => fileChangeHandler(e, "video")} />

        <Button onClick={createPostHandler} disabled={loading} className="bg-blue-700 text-white rounded-xl px-4 py-2 w-full mt-3">
          {loading ? <Loader2 className="animate-spin" /> : "Post"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
