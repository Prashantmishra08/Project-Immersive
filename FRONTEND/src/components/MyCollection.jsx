import React, { useEffect, useState } from "react";
import axios from "axios";

const MyCollection = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const imageResponse = await axios.post(
          "http://localhost:3000/api/collections/images",
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // ✅ Sends token via cookies
          }
        );

        const videoResponse = await axios.post(
          "http://localhost:3000/api/collections/videos",
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // ✅ Sends token via cookies
          }
        );

        setImages(imageResponse.data.files);
        setVideos(videoResponse.data.files);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-[#E1EFF1] p-4 max-w-5xl mx-auto dark:bg-slate-950 dark:text-slate-100">
      <h1 className="text-xl font-bold text-center mb-4">My Collection</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <h2 className="text-lg font-semibold mt-6">Images</h2>
      <div className="grid grid-cols-4 gap-2">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="relative group border border-gray-200 rounded-md overflow-hidden aspect-square">
              <img src={image.url} alt={`Saved image ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition"></div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4">No images found.</p>
        )}
      </div>

      <h2 className="text-lg font-semibold mt-6">Videos</h2>
      <div className="grid grid-cols-4 gap-2">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <div key={index} className="relative group border border-gray-200 rounded-md overflow-hidden">
              <video controls className="w-full h-full object-cover">
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition"></div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4">No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default MyCollection;
