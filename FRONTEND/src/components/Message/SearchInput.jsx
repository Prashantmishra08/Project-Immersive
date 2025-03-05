import { useState } from "react";
import { MdSearch } from "react-icons/md";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";
import useThemeStore from "../../zustand/useThemeStore"; // ✅ Theme Store Imported

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const { isDark } = useThemeStore(); // ✅ Theme State Used

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };

  const filteredConversations = conversations.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-sm pt-28">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <MdSearch className={`absolute left-3 w-6 h-6 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
        <input
          type="text"
          placeholder="Search…"
          className={`w-full pl-10 pr-4 py-3 rounded-full border transition-all duration-300 focus:ring-2 focus:outline-none ${
            isDark
              ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-400"
              : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* Search Results Dropdown */}
      {search && (
        <div
          className={`absolute z-10 w-full mt-2 shadow-lg rounded-lg max-h-60 overflow-y-auto transition-all ${
            isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900 border border-gray-200"
          }`}
        >
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`flex gap-3 items-center p-3 cursor-pointer transition-all ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setSearch("");
                }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={conversation.avatar}
                    alt="avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="font-semibold">{conversation.fullName}</p>
              </div>
            ))
          ) : (
            <p className="p-3 text-red-500 text-sm">No users found!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
