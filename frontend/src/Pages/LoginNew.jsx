import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { assets } from '../assets/assets';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading } = useAuth();
    
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus('');

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login Error:", error);
            
            if (error.code === 401) {
                setStatus('Invalid email or password.');
            } else if (error.code === 429) {
                setStatus('Too many failed attempts. Please try again later.');
            } else {
                setStatus('Login failed. Please check your connection.');
            }
        }
    };

    // Styles
    const cardClass = `w-full max-w-sm p-8 rounded-2xl shadow-2xl transition-all duration-500 
                     bg-white dark:bg-[#282136] text-gray-800 dark:text-white`;

    const inputClass = `w-full p-3 mt-1 rounded-lg border text-sm outline-none transition-colors
                      bg-gray-50 dark:bg-[#3E3452] border-gray-300 dark:border-[#583C79] 
                      focus:border-[#80609F] dark:focus:border-primary`;

    const buttonClass = `w-full py-3 mt-6 font-semibold rounded-lg transition duration-300 flex justify-center items-center
                       ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#80609F] hover:bg-[#6A4D85] dark:bg-primary dark:text-gray-900 dark:hover:bg-[#E6CCFF] text-white'}`;

    return (
        <div className='flex items-center justify-center h-screen w-full dark:bg-black transition-colors duration-500'>
            <div className={cardClass}>
                <div className="text-center mb-6">
                    <img 
                        src={theme === 'dark' ? assets.logo_dark_mode : assets.logo_light_mode}
                        className='w-16 mx-auto mb-4'
                        alt="Logo"
                    />
                    <h2 className='text-3xl font-bold'>Welcome Back</h2>
                    <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>
                        Sign in to continue your project discovery.
                    </p>
                </div>
                
                <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium'>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className='block text-sm font-medium'>Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClass}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={buttonClass} 
                        disabled={loading}
                    >
                        {loading ? (
                           <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Log In'
                        )}
                    </button>
                </form>

                {status && (
                    <p className={`text-center text-xs mt-4 font-semibold ${
                        status.includes('successful') ? 'text-green-500' : 'text-red-500'
                    }`}>
                        {status}
                    </p>
                )}

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => navigate('/register')}
                            className="text-[#80609F] dark:text-primary hover:underline"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
