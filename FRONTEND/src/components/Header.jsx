import React, { useState, useEffect } from 'react';

const Header = ({ user }) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  const timeString = dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });




  return (
    <div className="flex justify-between items-center p-4 dark:bg-gray-800  dark:text-white  bg-white text-black shadow-md">
      {/* User Profile */}
      <div className="flex items-center gap-3">
        <img src={user?.profilePic} alt="Profile" className="w-10 h-10 rounded-full" />
        <span className="font-semibold">{user?.username || "User"}</span>
      </div>

      {/* Date & Time */}
      <div className="text-right">


      <div className="text-xl ">{timeString}</div>



        {/* <div className="text-lg font-semibold">{dateTime.toLocaleTimeString()}</div> */}
        <div className="text-sm">{dateTime.toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default Header;