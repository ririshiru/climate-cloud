import React, { useState } from 'react'
import { useAppContext } from '../Context/AppContext'
import {assets} from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom' // Import the hook

const NavSidebar = ({isMenuOpen, setIsMenuOpen}) => { // 🛠️ FIX 1: Accepting menu state as props

  const {chats, setSelectedChat, theme, setTheme, user} = useAppContext()
  const [search, setSearch] = useState('')
  
  const navigate = useNavigate()

  // Placeholder function for logout. 
  const handleLogout = () => {
      console.log("Logging out...");
  }
  
  // Placeholder function for selecting a chat (used in the mapped chats below)
  const handleSelectChat = (chat) => {
      setSelectedChat(chat);
      // 🛠️ FIX 4: Close the menu when a chat is selected on mobile
      if (setIsMenuOpen) { 
          setIsMenuOpen(false); 
      }
      // You should also navigate to the main chat window if you are on a different page
      navigate('/');
  }

  return (
    // 🛠️ FIX 2: Apply conditional class for mobile menu sliding:
    <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-
      [#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl
      transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      
      {/* 🛠️ FIX 5: Close Icon (Must be inside the main sidebar div) */}
      <img 
          src={assets.close_icon} 
          className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' 
          alt="Close menu" 
          onClick={() => setIsMenuOpen(false)} // 🛠️ FIX 5b: Add click handler
      />

      {/* LOGO (Header) */}
      <img 
        src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode} 
        alt="logo" 
        className='w-full max-w-60 mr-auto ml-3 mt-2' 
      />

      {/* NEW PROBLEM BUTTON */}
      <button 
  onClick={() => {
    setSelectedChat(null);
    setMessages([]);
    setTopChallenges(null);
    setIsProfiling(true);
  }}
  className="btn mx-4 py-3 px-2 mt-3 text-white bg-gradient-to-r from-[#56dcf7] to-[#3D81F6] text-sm rounded-md cursor-pointer flex justify-center items-center"
>
  Find New Problem
</button>

      {/* Search Conversations Input */}
      <div className='flex items-center gap-2 mt-4 mx-4 p-3 border  border-gray-400 dark:border-white/20 rounded-md'>
        <img src={assets.searchblack} className='w-5 not-dark:invert' alt="Search" />
        <input 
          onChange={(e) => setSearch(e.target.value)} 
          value={search} 
          type="text"
          placeholder='Search conversations' 
          className='text-xs placeholder:text-gray-400 outline-none w-full bg-transparent'
        />
      </div>

      {/* Recent Chats Header */}
      {chats.length > 0 && 
        <p className='mt-4 text-sm mx-4'>Recent Chats</p>
      }

      {/* Chat List Container */}
      <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
          {
              chats.filter((chat) => 
                  chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())
              ).map((chat) => (
                  <div 
                      key={chat._id} 
                      className='p-2 mx-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group'
                      onClick={() => handleSelectChat(chat)} // 🛠️ FIX 6: Use selection handler
                  >
                      {/* Chat Content */}
                      <div>
                          <p className='truncate w-full'>
                              {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>
                              {moment(chat.updatedAt).fromNow()}
                          </p>
                      </div>
                      
                      {/* Bin Icon */}
                      <img 
                          src={assets.binlightmode} 
                          className='hidden group-hover:block w-4 h-4 flex-shrink-0 cursor-pointer not-dark:invert'
                          alt="Delete Chat" 
                      />
                  </div>
              ))
          }
      </div>

      {/* My Impact Link */}
      <div 
          onClick={() => { navigate('/ImpactPage') }} // 🛠️ FIX 3: Corrected path
          className='flex items-center gap-2 p-2 mx-4 mb-2 border border-gray-300 
          dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.01] transition-all'
      >
          <img src={assets.MyImpact} className='w-5 not-dark:invert' alt="My Impact Icon" />
          
          <div className='flex flex-col text-sm'>
              <p>My Impact</p>
          </div>
      </div>

      {/* For Investors Link */}
      <div 
          onClick={() => { navigate('/InvestorPage') }} // 🛠️ FIX 3: Corrected path
          className='flex items-center gap-2 p-2 mx-4 mt-4 mb-2 border border-gray-300 
          dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.01] transition-all'
      >
          <img src={assets.diamond_icon} className='w-5 not-dark:invert' alt="Investor Icon" />
          
          <div className='flex flex-col text-sm'>
              <p>For Investors</p>
          </div>
      </div>

      {/* User Account */}
      <div 
          className='flex items-center gap-3 p-3 mx-4 mt-4 mb-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'
          onClick={user ? handleLogout : () => navigate('/login')} // Example login/logout handler
      >
          <img src={assets.user_icon} className='w-7 rounded-full' alt="User Profile" />
          <p className='flex-1 text-sm  dark:text-primary truncate'>
              {user ? user.name : 'Login your account'}
          </p>
          {user && 
              <img 
                  src={assets.logout_icon} 
                  className='h-5 cursor-pointer hidden not-dark:invert group-hover:block' 
                  alt="Logout" 
              />}
      </div>
      
    </div>
  )
}

export default NavSidebar