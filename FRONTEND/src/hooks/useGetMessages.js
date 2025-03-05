import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import axios from "axios";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Token retrieve karo
        const res = await axios.get(`http://localhost:3000/api/messages/${selectedConversation._id}`, {
          headers: { Authorization: `Bearer ${token}` }, // Token headers me pass karo
        });

        // Only update messages if they are different from the current state
        if (JSON.stringify(res.data) !== JSON.stringify(messages)) {
          setMessages(res.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages, messages]); // Add messages to dependency to avoid redundant state updates

  return { messages, loading };
};


export default useGetMessages;
