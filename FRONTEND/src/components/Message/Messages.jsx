import { useEffect, useRef, useState } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "./MessageSkeleton";
import useListenMessages from "../../hooks/useListenMessages";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import useThemeStore from "../../zustand/useThemeStore"; // ✅ Theme Store Import किया
import axios from "axios";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const { setMessages } = useConversation();
  const { isDark } = useThemeStore(); // ✅ Dark Mode State Used

  // Ensure messages are always in array form
  const messagesArray = Array.isArray(messages) ? messages : [];

  useListenMessages();
  const lastMessageRef = useRef();
  const { authUser } = useAuthContext();
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [reactions, setReactions] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (messagesArray.length > 0) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 1);
    }
  }, [messagesArray]);

  const handleEdit = (id, text) => {
    setEditingMessage(id);
    setEditedText(text);
  };

  const handleSaveEdit = async (id) => {
    setIsEditing(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/messages/${id}`,
        { message: editedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === id ? { ...msg, message: editedText } : msg
        )
      );

      setEditingMessage(null);
    } catch (error) {
      console.error("Failed to edit message:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReaction = (id, emoji) => {
    setReactions((prev) => {
      if (prev[id] === emoji) {
        const updatedReactions = { ...prev };
        delete updatedReactions[id];
        return updatedReactions;
      }
      return { ...prev, [id]: emoji };
    });
  };

  return (
    <div
      className={`px-6 flex-1 overflow-y-auto no-scrollbar space-y-8 pb-4 transition-all ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {!loading && messagesArray.length > 0 ? (
        messagesArray.map((message) => {
          const fromMe = message.senderId === authUser._id;
          const messageAlignment = fromMe ? "justify-end" : "justify-start";
          const bubbleBgColor = fromMe
            ? isDark
              ? "bg-blue-500 text-white"
              : "bg-blue-600 text-white"
            : isDark
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-black";
          const bubbleSide = fromMe ? "ml-auto" : "mr-auto";

          return (
            <div
              key={message._id}
              ref={lastMessageRef}
              className={`flex ${messageAlignment}`}
              onMouseEnter={() => setHoveredMessage(message._id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div
                className={`relative p-3 max-w-[75%] md:max-w-[80%] ${bubbleBgColor} rounded-2xl shadow-md ${bubbleSide} group transition-all`}
              >
                {editingMessage === message._id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className={`w-full border rounded p-1 transition-all ${
                        isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-gray-100 border-gray-400 text-black"
                      }`}
                    />
                    <button
                      onClick={() => handleSaveEdit(message._id)}
                      className="text-green-500 font-bold hover:text-green-700"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <p className="break-words">{message.message}</p>
                )}

                {reactions[message._id] && (
                  <div className="text-sm mt-1">{reactions[message._id]}</div>
                )}

                <div className="flex items-center mt-1 space-x-4 opacity-100 group-hover:opacity-100 transition">
                  {fromMe && (
                    <button
                      onClick={() => handleEdit(message._id, message.message)}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(message._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>

                {hoveredMessage === message._id && (
                  <div
                    className={`absolute -bottom-7 right-0 flex space-x-1 p-1 rounded shadow-md ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {["😀", "❤️", "🔥", "😂", "👍"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(message._id, emoji)}
                        className="hover:scale-110 transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        !loading && messagesArray.length === 0 && (
          <p className="text-center">Send a message to start the conversation</p>
        )
      )}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
    </div>
  );
};

export default Messages;
