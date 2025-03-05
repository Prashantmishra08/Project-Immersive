import { useState } from "react";
import { Bell, MessageCircle, Search, Menu, Home, Compass, PlusCircle, Settings, LogOut } from "lucide-react";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Left) */}
      <aside className={`bg-white shadow-lg h-full p-4 transition-all ${isSidebarOpen ? "w-64" : "w-16"}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mb-4">
          <Menu size={24} />
        </button>
        <nav className="mt-4 flex flex-col gap-4">
          <NavItem icon={<Home size={24} />} text="Home" isOpen={isSidebarOpen} />
          <NavItem icon={<Compass size={24} />} text="Explore" isOpen={isSidebarOpen} />
          <NavItem icon={<PlusCircle size={24} />} text="Create" isOpen={isSidebarOpen} />
          <NavItem icon={<Settings size={24} />} text="Settings" isOpen={isSidebarOpen} />
          <NavItem icon={<LogOut size={24} />} text="Logout" isOpen={isSidebarOpen} />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar (Top) */}
        <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
          {/* Search Bar */}
          <div className="flex items-center gap-4 bg-gray-100 px-3 py-2 rounded-md w-1/3">
            <Search size={20} className="text-gray-500" />
            <input type="text" placeholder="Search..." className="bg-transparent w-full focus:outline-none"/>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
            <Bell size={24} className="text-gray-600 cursor-pointer" />
            <MessageCircle size={24} className="text-gray-600 cursor-pointer" />
            <img src="/avatar.jpg" alt="Profile" className="w-10 h-10 rounded-full cursor-pointer" />
          </div>
        </nav>

        {/* Header (Below Navbar) */}
        <header className="bg-blue-500 text-white p-4 shadow-md">
          <h1 className="text-xl font-semibold">Welcome back, Prashant! 👋</h1>
          <p className="text-sm">Check out the latest updates and trending posts.</p>
        </header>

        {/* Main Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

// Sidebar Navigation Item Component
function NavItem({ icon, text, isOpen }) {
  return (
    <div className="flex items-center gap-4 text-gray-700 hover:bg-gray-200 rounded-md p-2 cursor-pointer">
      {icon}
      {isOpen && <span className="text-md">{text}</span>}
    </div>
  );
}
