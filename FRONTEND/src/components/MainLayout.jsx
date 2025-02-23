
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import Home from './Home'


const MainLayout = () => {
  const [isDark,SetIsDark]=useState(false)
  return (
    <div className={`${isDark && "dark"}`}>
    <div className='dark:bg-slate-950'>
    <LeftSideBar isDark={isDark} SetIsDark={SetIsDark} />
    <div>
      <Outlet/>
      {/* <Home isDark={isDark} SetIsDark={SetIsDark} /> */}
    </div>
    </div>
    </div>
  )
}

export default MainLayout
