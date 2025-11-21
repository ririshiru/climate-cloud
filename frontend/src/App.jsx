import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import InvestorsPage from "./Pages/InvestorsPage.jsx";
import ChatWindow from './Components/ChatWindow.jsx'
import ImpactPage from './Pages/ImpactPage.jsx'
import NavSidebar from './Components/NavSidebar.jsx';
import { useAppContext } from './Context/AppContext'
import { assets } from './assets/assets'; // For the menu icon

const App = () => {
    // State to manage the visibility of the sidebar on mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const { theme } = useAppContext();

    return (
        <>
            <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
                <div className='flex h-screen w-screen'>
                    
                    {/* Pass menu state and setter to NavSidebar */}
                    <NavSidebar 
                        isMenuOpen={isMenuOpen} 
                        setIsMenuOpen={setIsMenuOpen} 
                    />
                    
                    <div className="flex-grow h-screen overflow-y-auto relative">

                        {/* Mobile Menu Open Icon (Visible only when menu is closed on mobile) */}
                        {!isMenuOpen && 
                            <img 
                                src={assets.menu_icon} 
                                className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-20' 
                                onClick={() => setIsMenuOpen(true)}
                                alt="Open menu" 
                            />
                        }
                    {!isMenuOpen && 
            <img 
                src={assets.menu_icon} 
                className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-20' 
                onClick={() => setIsMenuOpen(true)}
                alt="Open menu" 
            />
        }
                        <Routes> 
                            <Route path='/' element= {<ChatWindow/>}/>
                            <Route path='/InvestorPage' element= {<InvestorsPage/>}/>
                            <Route path='/ImpactPage' element= {<ImpactPage/>}/>
                        </Routes>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default App