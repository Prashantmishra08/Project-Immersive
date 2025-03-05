import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import useThemeStore from "../../zustand/useThemeStore"; // ✅ Theme Store Import

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const { isDark } = useThemeStore(); // ✅ Dark Mode State Used

  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        className={`flex gap-3 items-center rounded-lg p-3 py-2 my-4 cursor-pointer transition-all duration-300 ease-in-out 
        ${
          isSelected
            ? isDark
              ? "bg-sky-700 text-white"
              : "bg-sky-500 text-white"
            : isDark
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-gray-100 text-black hover:bg-gray-200"
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`relative avatar ${isOnline ? "online" : ""}`}>
          <div
            className={`w-14 h-14 rounded-full border-2 ${
              isDark ? "border-gray-600" : "border-gray-300"
            } overflow-hidden`}
          >
            <img
              src={conversation.avatar}
              alt="user avatar"
              className="object-cover w-full h-full"
            />
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <p
              className={`font-semibold text-sm ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {conversation.fullName}
            </p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>

      {!lastIdx && (
        <div
          className={`divider my-2 py-0 h-1 ${
            isDark ? "border-gray-700" : "border-gray-300"
          }`}
        />
      )}
    </>
  );
};

export default Conversation;
