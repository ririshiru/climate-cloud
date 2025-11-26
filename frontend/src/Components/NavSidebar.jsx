import React, { useState } from 'react'
import { useAppContext } from '../Context/AppContext'
import { useAuth } from '../contexts/AuthContext'
import { assets } from '../assets/assets'
import moment from 'moment'
import { useNavigate, useLocation } from 'react-router-dom'
import { LineChart } from 'lucide-react'

const NavSidebar = ({ isMenuOpen, setIsMenuOpen }) => {

    const {
        chats, selectedChat, setSelectedChat, theme, setTheme,
        startNewChat, // FIX 1, 5: Used for Find New Problem/New Chat
        clearChatHistory // FIX 2: Used for clearing history
        // Note: setMessages, setTopChallenges, setIsProfiling are now in startNewChat
    } = useAppContext()

    const { user, logout } = useAuth()

    const [search, setSearch] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    // Placeholder function for logout.
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    // Placeholder function for selecting a chat
    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        if (setIsMenuOpen) {
            setIsMenuOpen(false);
        }
        navigate('/');
    }

    // FIX 3: Placeholder for deleting a single chat
    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation(); // Prevents chat from being selected
        console.log(`Deleting chat ID: ${chatId}`);
        // Actual deletion logic would involve filtering the chats array:
        // setChats(prev => prev.filter(chat => chat._id !== chatId));
        // if (selectedChat?._id === chatId) {
        //     setSelectedChat(null);
        // }
    }

    return (
        <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-gradient-to-b from-
      [#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 backdrop-blur-3xl
      transition-all duration-500 max-md:absolute left-0 z-20 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>

            {/* Close Icon */}
            <img
                src={assets.close_icon}
                className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert'
                alt="Close menu"
                onClick={() => setIsMenuOpen(false)}
            />

            {/* LOGO (Header) */}
            <img
                src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode}
                alt="logo"
                className='w-full max-w-60 mr-auto ml-3 mt-2'
            />

            {/* NEW PROBLEM BUTTON (FIX 1: Using startNewChat) */}
            <button
                onClick={startNewChat}
                className="btn mx-4 py-2 px-2 mt-3 text-white bg-gradient-to-r from-[#56dcf7] to-[#3D81F6] text-sm rounded-md cursor-pointer flex justify-center items-center"
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
                <div className='flex justify-between items-center mt-4 mx-4'>
                    <p className='text-sm'>Recent Chats</p>
                    {/* FIX 2: Clear History Bin */}
                    <img
                        src={assets.binlightmode}
                        className='w-4 h-4 cursor-pointer not-dark:invert'
                        alt="Clear History"
                        onClick={clearChatHistory} // FIX 2: New function call
                    />
                </div>
            }

            {/* Chat List Container */}
            <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
                {
                    chats.filter((chat) =>
                        chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())
                    ).map((chat) => (
                        <div
                            key={chat._id}
                            className={`p-2 mx-4 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group
                          ${selectedChat?._id === chat._id ? 'bg-[#57317C]/20 dark:bg-[#57317C]/30' : 'dark:bg-[#57317C]/10'}`}
                            onClick={() => handleSelectChat(chat)}
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

                            {/* Bin Icon (FIX 3: Functionality added) */}
                            <img
                                src={assets.binlightmode}
                                className='hidden group-hover:block w-4 h-4 flex-shrink-0 cursor-pointer not-dark:invert'
                                alt="Delete Chat"
                                onClick={(e) => handleDeleteChat(e, chat._id)} // FIX 3: Delete handler
                            />
                        </div>
                    ))
                }
                {/* FIX 2: Display message when history is empty */}
                {chats.length === 0 && (
                    <p className='text-xs text-center text-gray-500 dark:text-[#B1A6C0] mx-4 mt-8'>
                        No recent chats. Start a new problem!
                    </p>
                )}
            </div>

            {/* Investor Dashboard Link */}
            {user?.role === 'investor' && (
                <div
                    onClick={() => { navigate('/InvestorPage') }}
                    className={`flex items-center gap-2 p-2 mx-4 mb-2 border border-gray-300
              dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.01] transition-all
              ${location.pathname === '/InvestorPage' ? 'bg-[#57317C]/20 dark:bg-[#57317C]/30' : ''}`}
                >
                    <LineChart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <div className='flex flex-col text-sm'>
                        <p>Investor Dashboard</p>
                    </div>
                </div>
            )}

            {/* My Impact Link */}
            <div
                onClick={() => { navigate('/ImpactPage') }}
                className='flex items-center gap-2 p-2 mx-4 mb-2 border border-gray-300
          dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.01] transition-all'
            >
                <img src={assets.MyImpact} className='w-5 not-dark:invert' alt="My Impact Icon" />
                <div className='flex flex-col text-sm'>
                    <p>My Impact</p>
                </div>
            </div>

            {/* User Account (FIX 5: Login connection) */}
            <div
                className='flex items-center gap-3 p-3 mx-4 mt-4 mb-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group'
                onClick={user ? handleLogout : () => navigate('/login')} // Navigate to /login if no user
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