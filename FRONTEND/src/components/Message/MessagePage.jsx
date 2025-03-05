// import React, { useState , useEffect , useRef } from "react";
// import { MessagesSquare } from 'lucide-react';


// const MessagePage = () => {
//     const [messages, setMessages] = useState([
//         { id: 1, text: "Hello!", sender: true, reaction: null, chatWith: 1, replyTo: null  },
//         { id: 2, text: "Hi, how are you?", sender: false, reaction: null, chatWith: 1 , replyTo: null },
//     ]);
//     const [newMessage, setNewMessage] = useState("");
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [popupMessageId, setPopupMessageId] = useState(null);
//     const [popupType, setPopupType] = useState(null);
//     const [showExtendedEmojis, setShowExtendedEmojis] = useState(false);
//     const [currentChatUserId, setCurrentChatUserId] = useState(null);
//     const [editingMessageId, setEditingMessageId] = useState(null);
//     const [replyingToMessage, setReplyingToMessage] = useState(null);
//     const popupRef = useRef(null);

//     const friends = [
//         {
//             id: 1,
//             userName: "JohnDoe",
//             profilePic: "/images/pexels-willianjusten-15829527.jpg",
//             status: "online",
//         },
//         {
//             id: 2,
//             userName: "JaneSmith",
//             profilePic: "/images/pexels-rajan-abdulla-2148461968-30110558.jpg",
//             status: "offline",
//         },
//         {
//             id: 3,
//             userName: "Jenni",
//             profilePic: "/images/pexels-tnp-1464613945-29971507.jpg",
//             status: "online",
//         },
//     ];

//     const sendMessage = () => {
//         if (editingMessageId) {
//             // Edit Message Logic
//             setMessages((prevMessages) =>
//                 prevMessages.map((msg) =>
//                     msg.id === editingMessageId ? { ...msg, text: newMessage } : msg
//                 )
//             );
//             setEditingMessageId(null);
//             setNewMessage("");
//         } else if (newMessage || selectedFile) {
//             // Send Message Logic
//             setMessages([
//                 ...messages,
//                 {
//                     id: Date.now(),
//                     text: newMessage,
//                     sender: true,
//                     reaction: null,
//                     file: selectedFile,
//                     chatWith: currentChatUserId,
//                     replyTo: replyingToMessage,
//                 },
//             ]);
//             setNewMessage("");
//             setSelectedFile(null);
//             setReplyingToMessage(null);
//         }
//     };

//     const closePopup = () => {
//         setPopupMessageId(null);
//         setShowExtendedEmojis(false);
//     };

//     const handlePopupOutsideClick = (e) => {
//         if (popupRef.current && !popupRef.current.contains(e.target)) {
//             closePopup();
//         }
//     };

//     const addReaction = (messageId, reaction) => {
//         setMessages((prevMessages) =>
//             prevMessages.map((msg) =>
//                 msg.id === messageId ? { ...msg, reaction } : msg
//             )
//         );
//         closePopup();
//     };

//     useEffect(() => {
//         document.addEventListener("click", handlePopupOutsideClick);
//         return () => document.removeEventListener("click", handlePopupOutsideClick);
//     }, []);

//      // Start Editing a Message
//      const editMessage = (message) => {
//         setNewMessage(message.text);
//         setEditingMessageId(message.id);
//     };

//     // Start Replying to a Message
//     const replyMessage = (message) => {
//         setReplyingToMessage(message);
//     };

//     // Filter messages for the currently selected user
//     const filteredMessages = messages.filter(
//         (msg) => msg.chatWith === currentChatUserId
//     );

//     return (
//         <div className="h-screen flex">
//             {/* Left Chat Section */}
//             <div className="flex-1 flex flex-col">
//                 {/* Header */}
//                 {currentChatUserId !== null && (
//                     <div className="p-4 border-b flex items-center space-x-4">
//                         <img
//                             src={friends.find((f) => f.id === currentChatUserId)?.profilePic}
//                             alt="Receiver"
//                             className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <div>
//                             <h1 className="font-bold text-lg">
//                                 {friends.find((f) => f.id === currentChatUserId)?.userName}
//                             </h1>
//                             <span
//                                 className={`text-sm ${
//                                     friends.find((f) => f.id === currentChatUserId)?.status ===
//                                     "online"
//                                         ? "text-green-500"
//                                         : "text-gray-500"
//                                 }`}
//                             >
//                                 {friends.find((f) => f.id === currentChatUserId)?.status ===
//                                 "online"
//                                     ? "Online"
//                                     : "Offline"}
//                             </span>
//                         </div>
//                     </div>
//                 )}

//                 {/* Messages */}
//                 <div className="flex-1 p-4 space-y-4 overflow-y-auto relative">
//                     {currentChatUserId === null ? (
//                         <div className=" flex flex-col items-center justify-center h-full text-gray-500">
//                             <div className="text-gray-700  ">
//                                 <MessagesSquare style={{ width: '150px', height: '150px' }} />
//                             </div>
                            
//                             <p className="bg-gray-100 p-4 italic" >Select a user to start chatting</p>
//                         </div>
//                     ) : filteredMessages.length > 0 ? (
//                         filteredMessages.map((message) => (
//                             <div
//                                 key={message.id}
//                                 className={`flex ${
//                                     message.sender ? "justify-end" : "justify-start"
//                                 }`}
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     setPopupMessageId(message.id);
//                                     setPopupType(message.sender ? "sender" : "receiver");
//                                 }}
//                             >
//                                 <div
//                                     className={`p-3 rounded-lg shadow-sm ${
//                                         message.sender
//                                             ? "bg-blue-500 text-white"
//                                             : "bg-gray-200 text-black"
//                                     } max-w-xs relative`}
//                                 >
//                                     {message.replyTo && (
//                                         <div className="text-sm text-gray-400 mb-2 border-l-2 pl-2">
//                                             {/* Replying to: {message.replyTo.text} */}
//                                             {/* Replying to: `${message}` */}
//                                             <span className="font-semibold">Replying to:</span> {message.replyTo.text}
 
//                                         </div>
//                                     )}
                                    

//                                     {message.text && <p>{message.text}</p>}
//                                     {message.file && (
//                                         <img
//                                             src={message.file}
//                                             alt="Uploaded"
//                                             className="w-full h-32 object-cover rounded-md mt-2"
//                                         />
//                                     )}
//                                     {message.reaction && (
//                                         <span className="absolute top-1 right-1 text-xl">
//                                             {message.reaction}
//                                         </span>
//                                     )}

//                                     {/* Popup */}
//                                     {popupMessageId === message.id && (
//                                         <div
//                                             ref={popupRef}
//                                             className={`absolute top-0 ${
//                                                 message.sender ? "right-0" : "left-0"
//                                             } mt-6 bg-white shadow-lg rounded-md z-10`}
//                                             onClick={(e) => e.stopPropagation()}
//                                         >
//                                             <div className="flex flex-col p-2">
//                                                 {/* Reaction Emojis */}
//                                                 <div className="flex justify-around border-b pb-2">
//                                                     {["❤️", "😂", "👍", "😮", "😢"].map((emoji) => (
//                                                         <button
//                                                             key={emoji}
//                                                             className="text-lg"
//                                                             onClick={() => addReaction(message.id, emoji)}
//                                                         >
//                                                             {emoji}
//                                                         </button>
//                                                     ))}
//                                                     <button
//                                                         onClick={() => setShowExtendedEmojis(true)}
//                                                         className="text-lg"
//                                                     >
//                                                         ➕
//                                                     </button>
//                                                 </div>
//                                                 {showExtendedEmojis && (
//                                                     <div className="flex flex-wrap max-w-xs mt-2">
//                                                         {[
//                                                             "😎", "😇", "🤓", "🥳", "🤩", "🙌", "🤔",
//                                                             "🤤", "🤯", "🤦‍♀️", "🤷‍♂️",
//                                                         ].map((emoji) => (
//                                                             <button
//                                                                 key={emoji}
//                                                                 className="text-lg px-2 py-1"
//                                                                 onClick={() => addReaction(message.id, emoji)}
//                                                             >
//                                                                 {emoji}
//                                                             </button>
//                                                         ))}
//                                                     </div>
//                                                 )}

//                                                 {/* Sender Options */}
//                                                 {popupType === "sender" && !showExtendedEmojis && (
//                                                     <>
//                                                         <button
//                                                             className="px-4 py-2 hover:bg-gray-100 text-left text-gray-700"
//                                                             onClick={() => {
//                                                                 replyMessage(`@${message.text} `);
//                                                                 closePopup();
//                                                             }}
//                                                         >
//                                                             Reply
//                                                         </button>
//                                                         <button
//                                                             className="px-4 py-2 hover:bg-gray-100 text-left text-gray-700"
//                                                             onClick={() => editMessage(message)}
//                                                         >
//                                                             Edit
//                                                         </button>
//                                                         <button
//                                                             className="px-4 py-2 hover:bg-gray-100 text-left text-red-500"
//                                                             onClick={() =>
//                                                                 setMessages((prevMessages) =>
//                                                                     prevMessages.filter(
//                                                                         (msg) => msg.id !== message.id
//                                                                     )
//                                                                 )
//                                                             }
//                                                         >
//                                                             Delete
//                                                         </button>
//                                                     </>
//                                                 )}

//                                                 {/* Receiver Options */}
//                                                 {popupType === "receiver" && !showExtendedEmojis && (
//                                                     <button
//                                                         className="px-4 py-2 hover:bg-gray-100 text-left"
//                                                         onClick={() => {
//                                                             replyMessage(`@${message.text} `);
//                                                             closePopup();
//                                                         }}
//                                                     >
//                                                         Reply
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}

//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="flex items-center justify-center h-full text-gray-500">
//                             <p className="bg-gray-100 p-4 italic text-center" >No messages yet.<br/> Send a message to start a chat.</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Input */}
//                 {currentChatUserId !== null && (
//                     <div className="p-4 border-t flex flex-col space-y-2">
//                         {replyingToMessage && (
//                             <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
//                                 <span className="text-sm text-gray-500">
//                                     Replying to: {replyingToMessage.text}
//                                 </span>
//                                 <button
//                                     onClick={() => setReplyingToMessage(null)}
//                                     className="text-gray-500 hover:text-red-500"
//                                 >
//                                     ✖
//                                 </button>
//                             </div>
//                         )}
//                         <div className="flex items-center space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder= {
//                                     editingMessageId 
//                                     ? "Editing message..."
//                                     : "Type a message..."
//                                 }
//                                 value={newMessage}
//                                 onChange={(e) => setNewMessage(e.target.value)}
//                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
//                             />
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) =>
//                                     setSelectedFile(URL.createObjectURL(e.target.files[0]))
//                                 }
//                                 className="hidden"
//                                 id="fileInput"
//                             />
//                             <label
//                                 htmlFor="fileInput"
//                                 className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-300"
//                             >
//                                 📎
//                             </label>
//                             <button
//                                 onClick={sendMessage}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                             >
//                                 {editingMessageId ? "Save" : "Send"}
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Right Sidebar */}
//             <div className="w-64 border-l p-4">
//                 <h2 className="text-lg font-bold mb-4">Messages</h2>
//                 {friends.map((friend) => (
//                     <div
//                         key={friend.id}
//                         className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
//                         onClick={() => setCurrentChatUserId(friend.id)}
//                     >
//                         <img
//                             src={friend.profilePic}
//                             alt={friend.userName}
//                             className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <div>
//                             <h3 className="font-medium">{friend.userName}</h3>
//                             <span
//                                 className={`text-sm ${
//                                     friend.status === "online" ? "text-green-500" : "text-gray-500"
//                                 }`}
//                             >
//                                 {friend.status === "online" ? "Online" : "Offline"}
//                             </span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default MessagePage;


// import { useEffect, useState, useRef } from "react";
// import { useSocketContext } from "../../context/SocketContext";
// import { useAuthContext } from "../../context/AuthContext";
// import axios from "axios";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search } from "lucide-react";
// import SearchInput from "./SearchInput";
// import Conversation from "./Conversation";
// import useConversation from "../../zustand/useConversation";
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";
// import useGetConversations from "@/hooks/useGetConversations";
// import { TiMessages } from "react-icons/ti";

// const API_BASE_URL = "http://localhost:3000/api";

// export default function MessagePage() {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const messagesEndRef = useRef(null);

//     const { authUser } = useAuthContext();
//     const { socket } = useSocketContext();
//     const { loading, conversations } = useGetConversations();
//     const { selectedConversation, setSelectedConversation } = useConversation();

//     useEffect(() => {
//         return () => setSelectedConversation(null);
//     }, [setSelectedConversation]);

//     useEffect(() => {
//         if (!selectedConversation) return;
//         const fetchMessages = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const { data } = await axios.get(`${API_BASE_URL}/messages/${selectedConversation._id}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setMessages(data);
//             } catch (error) {
//                 console.error("Error fetching messages:", error);
//             }
//         };
//         fetchMessages();
//     }, [selectedConversation]);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <div className="flex h-screen">
//             <div className="flex flex-col flex-1 bg-gray-800 p-4">
//                 {!selectedConversation ? (
//                     <NoChatSelected />
//                 ) : (
//                     <>
//                         <div className='bg-slate-500 px-4 py-2 mb-2'>
//                             <span className='label-text'>To:</span>{" "}
//                             <span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
//                         </div>
//                         <Messages messages={messages} />
//                         <MessageInput setMessages={setMessages} newMessage={newMessage} setNewMessage={setNewMessage} />
//                     </>
//                 )}
//             </div>

//             <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
//                 <SearchInput value={searchTerm} onChange={setSearchTerm} />
//                 <div className="flex-1 overflow-y-auto">
//                     {loading ? (
//                         <span className="loading loading-spinner mx-auto"></span>
//                     ) : conversations.length > 0 ? (
//                         conversations.map((conversation, idx) => (
//                             <Conversation key={conversation._id} conversation={conversation} />
//                         ))
//                     ) : (
//                         <p className="text-center text-gray-400">No conversations found</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// const NoChatSelected = () => {
//     const { authUser } = useAuthContext();
//     return (
//         <div className='flex items-center justify-center w-full h-full'>
//             <div className='px-4 text-center text-gray-200 font-semibold flex flex-col items-center gap-2'>
//                 <p>Welcome 👋 {authUser.fullName} ❄</p>
//                 <p>Select a chat to start messaging</p>
//                 <TiMessages className='text-3xl md:text-6xl' />
//             </div>
//         </div>
//     );
// };

import { useEffect, useState, useRef } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SearchInput from "./SearchInput";
import Conversation from "./Conversation";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import useGetConversations from "@/hooks/useGetConversations";
import { TiMessages } from "react-icons/ti";
import LeftSidebar from "../LeftSidebar.jsx";

const API_BASE_URL = "http://localhost:3000/api";

export default function MessagePage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef(null);

    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();
    const { loading, conversations } = useGetConversations();
    const { selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    useEffect(() => {
        if (!selectedConversation) return;
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`${API_BASE_URL}/messages/${selectedConversation._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* Chat Section */}
            <div className="flex-1 px-4 md:ml-64 w-full max-w-4xl mx-auto pt-28">
                <div className="flex flex-col bg-white dark:bg-gray-800 p-6 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
                    {!selectedConversation ? (
                        <NoChatSelected />
                    ) : (
                        <>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-3 mb-4 rounded-lg shadow-md">
                                <img src={selectedConversation.avatar} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                                <span className="text-gray-900 dark:text-gray-100 text-lg font-semibold">{selectedConversation.fullName}</span>
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[60vh] scrollbar-hide">
                                <Messages messages={messages} />
                            </div>
                            <div className="mt-4">
                                <MessageInput setMessages={setMessages} newMessage={newMessage} setNewMessage={setNewMessage} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Sidebar (Right Conversations) */}
            <div className="hidden md:flex md:w-1/4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex-col p-4 shadow-lg border-l border-gray-200 dark:border-gray-700">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
                <div className="flex-1 overflow-y-auto mt-4">
                    {loading ? (
                        <span className="loading loading-spinner mx-auto"></span>
                    ) : conversations.length > 0 ? (
                        conversations.map((conversation) => (
                            <Conversation key={conversation._id} conversation={conversation} />
                        ))
                    ) : (
                        <p className="text-center text-gray-400 dark:text-gray-500 mt-4">No conversations found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-6 text-center text-gray-700 dark:text-gray-300 font-semibold flex flex-col items-center gap-3">
                <p className="text-lg">Welcome 👋 {authUser.fullName} ❄</p>
                <p className="text-sm">Select a chat to start messaging</p>
                <TiMessages className="text-4xl md:text-6xl text-gray-500 dark:text-gray-400" />
            </div>
        </div>
    );
};
