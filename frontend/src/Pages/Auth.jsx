import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, loading } = useAuth();
    const { theme } = useAppContext();

    const [isLogin, setIsLogin] = useState(true);
    const [status, setStatus] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('innovator'); // 'innovator' or 'investor'
    const [profession, setProfession] = useState('');
    const [interests, setInterests] = useState('');

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');

        try {
            let user;
            if (isLogin) {
                user = await login(email, password);
            } else {
                user = await register(email, password, name, role, profession, interests);
            }

            // Role-based Redirect
            if (user?.role === 'investor') {
                navigate('/InvestorPage');
            } else {
                // For innovators, go to 'from' location or home (chat)
                navigate(from, { replace: true });
            }

        } catch (error) {
            console.error("Auth Error:", error);
            setStatus(error.message || 'Authentication failed. Please check your details.');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setStatus('');
    };

    // Styles
    const cardClass = `w-full max-w-md p-8 rounded-2xl shadow-2xl transition-all duration-500 
                     ${theme === 'dark' ? 'bg-[#282136] text-white border border-[#583C79]' : 'bg-white text-gray-800 border border-gray-200'}`;

    const inputClass = `w-full p-3 mt-1 rounded-lg border text-sm outline-none transition-colors
                      ${theme === 'dark' ? 'bg-[#3E3452] border-[#583C79] text-white focus:border-primary' : 'bg-gray-50 border-gray-300 focus:border-[#80609F]'}`;

    const buttonClass = `w-full py-3 mt-6 font-semibold rounded-lg transition duration-300 flex justify-center items-center
                       ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#80609F] hover:bg-[#6A4D85] dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF] text-white'}`;

    return (
        <div className='flex items-center justify-center min-h-screen w-full dark:bg-black transition-colors duration-500 py-10'>
            <div className={cardClass}>
                <div className="text-center mb-6">
                    <img
                        src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode}
                        alt="App Logo"
                        className='w-64 mx-auto mb-4'
                    />
                    <h2 className='text-3xl font-bold'>{isLogin ? 'Welcome Back' : 'Join Climate Cloud'}</h2>
                    <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>
                        {isLogin ? 'Sign in to continue your journey.' : 'Create an account to start making an impact.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    {!isLogin && (
                        <>
                            <div>
                                <label className='block text-sm font-medium'>Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputClass}
                                    placeholder="John Doe"
                                    required={!isLogin}
                                />
                            </div>

                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setRole('innovator')}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${role === 'innovator' ? 'border-[#80609F] bg-[#80609F]/10 dark:border-primary dark:bg-primary/20' : 'border-gray-300 dark:border-gray-600'}`}
                                >
                                    <p className="font-bold text-sm">Innovator</p>
                                </div>
                                <div
                                    onClick={() => setRole('investor')}
                                    className={`p-3 rounded-lg border cursor-pointer text-center transition-all ${role === 'investor' ? 'border-[#80609F] bg-[#80609F]/10 dark:border-primary dark:bg-primary/20' : 'border-gray-300 dark:border-gray-600'}`}
                                >
                                    <p className="font-bold text-sm">Investor</p>
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium'>Profession</label>
                                <input
                                    type="text"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    className={inputClass}
                                    placeholder={role === 'innovator' ? "Student, Engineer..." : "VC, Angel..."}
                                    required={!isLogin}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium'>Interests</label>
                                <input
                                    type="text"
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    className={inputClass}
                                    placeholder="Solar, Water, AI..."
                                    required={!isLogin}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className='block text-sm font-medium'>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium'>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className={buttonClass} disabled={loading}>
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            isLogin ? 'Log In' : 'Sign Up'
                        )}
                    </button>
                </form>

                {status && (
                    <p className={`text-center text-xs mt-4 font-semibold ${status.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                        {status}
                    </p>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={toggleMode}
                            className="text-[#80609F] dark:text-primary hover:underline font-bold"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
