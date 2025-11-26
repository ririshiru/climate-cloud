import React, { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import InvestorsPage from "./Pages/InvestorsPage.jsx";
import ChatWindow from './Components/ChatWindow.jsx'
import ImpactPage from './Pages/ImpactPage.jsx'
import NavSidebar from './Components/NavSidebar.jsx';
import AuthPage from './Pages/Auth.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import { useAppContext } from './Context/AppContext'
import { assets } from './assets/assets';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme } = useAppContext();
    const location = useLocation();

    // Hide sidebar on auth pages
    const isAuthPage = location.pathname === '/auth';

    return (
        <>
            <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
                <div className='flex h-screen w-screen'>

                    {!isAuthPage && (
                        <NavSidebar
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                        />
                    )}

                    <div className="flex-grow h-screen overflow-y-auto relative">

                        {/* Mobile Menu Open Icon (Visible only when menu is closed on mobile) */}
                        {!isMenuOpen && !isAuthPage &&
                            <img
                                src={assets.menu_icon}
                                className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-20'
                                onClick={() => setIsMenuOpen(true)}
                                alt="Open menu"
                            />
                        }

                        <Routes>
                            <Route path='/' element={
                                <ProtectedRoute>
                                    <ChatWindow />
                                </ProtectedRoute>
                            } />
                            <Route path='/InvestorPage' element={
                                <ProtectedRoute>
                                    <InvestorsPage />
                                </ProtectedRoute>
                            } />
                            <Route path='/ImpactPage' element={
                                <ProtectedRoute>
                                    <ImpactPage />
                                </ProtectedRoute>
                            } />
                            <Route path='/auth' element={<AuthPage />} />
                            <Route path='/login' element={<Navigate to="/auth" replace />} />
                            <Route path='/register' element={<Navigate to="/auth" replace />} />
                        </Routes>
                    </div>

                </div>
            </div>
        </>
    )
}

export default App