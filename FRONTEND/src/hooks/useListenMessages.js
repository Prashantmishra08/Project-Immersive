import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import axios from "axios";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const res = await axios.get(`http://localhost:3000/api/messages/${selectedConversation?._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    socket?.on("newMessage", async (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      
      // Option 1: Append new message directly
      setMessages([...messages, newMessage]);

      // Option 2: Fetch all messages again from server
      // await fetchMessages();
    });
    socket?.on("messageEdited", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });
  
    socket?.on("messageDeleted", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });
  
    return () => {
      socket?.off("newMessage");
      socket?.off("messageEdited");
      socket?.off("messageDeleted");
    };
  }, [socket, setMessages, messages, selectedConversation]);

  return null;
};

export default useListenMessages;
