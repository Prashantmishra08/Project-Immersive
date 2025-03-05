import { create } from "zustand";

// Inside your Zustand store file
const useConversation = create((set) => ({
	messages: [],
	selectedConversation: null,
	setMessages: (messages) => set({ messages }),
	setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  }));  

export default useConversation;
