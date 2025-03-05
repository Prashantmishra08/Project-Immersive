import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "./extractTime";
import useConversation from "../../zustand/useConversation";
import useThemeStore from "../../zustand/useThemeStore"; // ✅ Theme Store Import किया

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const { isDark } = useThemeStore(); // ✅ Dark Mode State Used

  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;

  const bubbleBgColor = fromMe
    ? isDark
      ? "bg-blue-600 text-white"
      : "bg-blue-500 text-white"
    : isDark
    ? "bg-gray-700 text-white"
    : "bg-gray-200 text-black";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Profile" src={profilePic} />
        </div>
      </div>
      <div className={`chat-bubble ${bubbleBgColor} pb-2`}>{message.text}</div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
