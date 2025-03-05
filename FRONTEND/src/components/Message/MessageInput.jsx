import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useThemeStore from "../../zustand/useThemeStore"; // ✅ Theme Store Import किया

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { isDark } = useThemeStore(); // ✅ Dark Mode State Used

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    await sendMessage(trimmedMessage);
    setMessage("");
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div
        className={`w-full relative flex items-center rounded-lg shadow-lg p-3 hover:shadow-xl transition-shadow ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <input
          type="text"
          className={`flex-1 text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-400 text-black"
          }`}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Type your message"
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all duration-200 ease-in-out disabled:opacity-50"
          disabled={loading || !message.trim()}
          title="Send Message"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
